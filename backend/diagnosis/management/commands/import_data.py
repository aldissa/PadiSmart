"""
Management command: import_data
Usage:
    python manage.py import_data
    python manage.py import_data --csv-dir path/ke/folder/csv
    python manage.py import_data --clear   # hapus data lama dulu

Urutan import: penyakit → gejala → relasi_penyakit_gejala
"""

import csv
import os
from decimal import Decimal

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

# Sesuaikan import model dengan nama app kamu
from pengetahuan.models import Penyakit, Gejala, RelasiPenyakitGejala


class Command(BaseCommand):
    help = "Import data penyakit, gejala, dan relasi dari file CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "--csv-dir",
            type=str,
            default=os.path.join(os.path.dirname(__file__), "../../../../data"),
            help="Path ke folder berisi file CSV (default: folder data/ di root project)",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Hapus semua data lama sebelum import (urutan terbalik agar FK aman)",
        )

    def handle(self, *args, **options):
        csv_dir = os.path.abspath(options["csv_dir"])

        if not os.path.isdir(csv_dir):
            raise CommandError(f"Folder CSV tidak ditemukan: {csv_dir}")

        self.stdout.write(f"📂 Membaca CSV dari: {csv_dir}")

        # ── Hapus data lama jika --clear ──────────────────────────────────────
        if options["clear"]:
            self.stdout.write(self.style.WARNING("⚠️  Menghapus data lama..."))
            RelasiPenyakitGejala.objects.all().delete()
            Gejala.objects.all().delete()
            Penyakit.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("✅ Data lama berhasil dihapus"))

        # ── Import dalam satu transaksi ────────────────────────────────────────
        with transaction.atomic():
            total_penyakit  = self._import_penyakit(csv_dir)
            total_gejala    = self._import_gejala(csv_dir)
            total_relasi    = self._import_relasi(csv_dir)

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 50))
        self.stdout.write(self.style.SUCCESS("✅ Import selesai!"))
        self.stdout.write(f"   • Penyakit  : {total_penyakit} baris")
        self.stdout.write(f"   • Gejala    : {total_gejala} baris")
        self.stdout.write(f"   • Relasi    : {total_relasi} baris")
        self.stdout.write(self.style.SUCCESS("=" * 50))

    # ── Helper: import penyakit.csv ────────────────────────────────────────────
    def _import_penyakit(self, csv_dir):
        path = os.path.join(csv_dir, "penyakit.csv")
        self._check_file(path, "penyakit.csv")

        count = 0
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                Penyakit.objects.update_or_create(
                    id_penyakit=int(row["id_penyakit"]),
                    defaults={
                        "nama_penyakit": row["nama_penyakit"].strip(),
                        "deskripsi":     row.get("deskripsi", "").strip(),
                        "penanganan":    row.get("penanganan", "").strip(),
                    },
                )
                count += 1

        self.stdout.write(f"  📌 Penyakit  : {count} baris diimport")
        return count

    # ── Helper: import gejala.csv ──────────────────────────────────────────────
    def _import_gejala(self, csv_dir):
        path = os.path.join(csv_dir, "gejala.csv")
        self._check_file(path, "gejala.csv")

        count = 0
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                Gejala.objects.update_or_create(
                    kode_gejala=row["kode_gejala"].strip(),
                    defaults={
                        "nama_gejala": row["nama_gejala"].strip(),
                    },
                )
                count += 1

        self.stdout.write(f"  📌 Gejala    : {count} baris diimport")
        return count

    # ── Helper: import relasi_penyakit_gejala.csv ─────────────────────────────
    def _import_relasi(self, csv_dir):
        path = os.path.join(csv_dir, "relasi_penyakit_gejala.csv")
        self._check_file(path, "relasi_penyakit_gejala.csv")

        count   = 0
        skipped = 0

        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                id_penyakit  = int(row["id_penyakit"])
                kode_gejala  = row["kode_gejala"].strip()

                # Pastikan FK-nya ada sebelum insert
                try:
                    penyakit = Penyakit.objects.get(id_penyakit=id_penyakit)
                    gejala   = Gejala.objects.get(kode_gejala=kode_gejala)
                except Penyakit.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f"  ⚠️  Penyakit id={id_penyakit} tidak ditemukan, baris dilewati"
                        )
                    )
                    skipped += 1
                    continue
                except Gejala.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f"  ⚠️  Gejala kode={kode_gejala} tidak ditemukan, baris dilewati"
                        )
                    )
                    skipped += 1
                    continue

                RelasiPenyakitGejala.objects.update_or_create(
                    id_penyakit=penyakit,
                    kode_gejala=gejala,
                    defaults={
                        "mb":       Decimal(row["mb"]),
                        "md":       Decimal(row["md"]),
                        "cf_pakar": Decimal(row["cf_pakar"]),
                    },
                )
                count += 1

        if skipped:
            self.stdout.write(
                self.style.WARNING(f"  ⚠️  Relasi dilewati (FK tidak ada): {skipped} baris")
            )
        self.stdout.write(f"  📌 Relasi    : {count} baris diimport")
        return count

    # ── Helper: cek file ada ───────────────────────────────────────────────────
    def _check_file(self, path, filename):
        if not os.path.isfile(path):
            raise CommandError(
                f"File tidak ditemukan: {path}\n"
                f"Pastikan '{filename}' ada di folder yang benar."
            )
