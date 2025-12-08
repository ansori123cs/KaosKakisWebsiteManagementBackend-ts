import {
  pgTable,
  unique,
  serial,
  varchar,
  text,
  integer,
  foreignKey,
  date,
  timestamp,
  check,
  numeric,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const jenisMesin = pgTable(
  "jenis_mesin",
  {
    id: serial().primaryKey().notNull(),
    nama: varchar({ length: 255 }).notNull(),
    kodeMesin: text("kode_mesin"),
    status: integer(),
  },
  (table) => [unique("data_mesin_nama_key").on(table.nama)]
);

export const kaosKaki = pgTable(
  "kaos_kaki",
  {
    id: serial().primaryKey().notNull(),
    nama: varchar({ length: 255 }).notNull(),
    jenisBahanId: integer("jenis_bahan_id"),
    keterangan: text(),
    lastOrderDate: date("last_order_date"),
    createdAt: timestamp({ withTimezone: true, mode: "string" }),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }),
    kodeKaosKaki: text("kode_kaos_kaki"),
    status: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.jenisBahanId],
      foreignColumns: [jenisBahan.id],
      name: "kaos_kaki_jenis_bahan_id_fkey",
    }),
    unique("uk_nama_jenis").on(table.nama, table.jenisBahanId),
  ]
);

export const jenisBahan = pgTable(
  "jenis_bahan",
  {
    id: serial().primaryKey().notNull(),
    nama: varchar({ length: 255 }).notNull(),
    kodeBahan: text("kode_bahan"),
    status: integer(),
  },
  (table) => [unique("jenis_bahan_nama_key").on(table.nama)]
);

export const ukuran = pgTable(
  "ukuran",
  {
    id: serial().primaryKey().notNull(),
    nama: varchar({ length: 255 }).notNull(),
    kodeUkuran: text("kode_ukuran"),
    status: integer(),
  },
  (table) => [unique("ukuran_nama_key").on(table.nama)]
);

export const warna = pgTable(
  "warna",
  {
    id: serial().primaryKey().notNull(),
    nama: varchar({ length: 255 }).notNull(),
    kodeWarna: text("kode_warna"),
    status: integer(),
  },
  (table) => [unique("warna_nama_key").on(table.nama)]
);

export const pesanan = pgTable("pesanan", {
  id: serial().primaryKey().notNull(),
  namaPemesan: varchar("nama_pemesan", { length: 255 }).notNull(),
  catatan: text(),
  createdAt: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
  status: integer(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
});

export const pesananDetail = pgTable(
  "pesanan_detail",
  {
    id: serial().primaryKey().notNull(),
    pesananId: integer("pesanan_id").notNull(),
    kaosKakiVariasiId: integer("kaos_kaki_variasi_id").notNull(),
    jumlah: integer().notNull(),
    hargaSatuan: numeric("harga_satuan", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.kaosKakiVariasiId],
      foreignColumns: [kaosKakiVariasiDetail.id],
      name: "pesanan_detail_kaos_kaki_variasi_id_fkey",
    }),
    foreignKey({
      columns: [table.pesananId],
      foreignColumns: [pesanan.id],
      name: "pesanan_detail_pesanan_id_fkey",
    }).onDelete("cascade"),
    check(
      "pesanan_detail_harga_satuan_check",
      sql`harga_satuan > (0)::numeric`
    ),
    check("pesanan_detail_jumlah_check", sql`jumlah > 0`),
  ]
);

export const fotoKaosKaki = pgTable(
  "foto_kaos_kaki",
  {
    id: serial().primaryKey().notNull(),
    kaosKakiId: integer("kaos_kaki_id").notNull(),
    url: text().notNull(),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.kaosKakiId],
      foreignColumns: [kaosKaki.id],
      name: "foto_kaos_kaki_kaos_kaki_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const dataMesin = pgTable(
  "data_mesin",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "data_mesin_id_seq1",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    kaosKakiId: integer("kaos_kaki_id"),
    jenisMesinId: integer("jenis_mesin_id"),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.jenisMesinId],
      foreignColumns: [jenisMesin.id],
      name: "data_mesin_jenis_mesin_id_fkey",
    }),
    foreignKey({
      columns: [table.kaosKakiId],
      foreignColumns: [kaosKaki.id],
      name: "data_mesin_kaos_kaki_id_fkey",
    }),
  ]
);

export const status = pgTable("status", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "status_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 9223372036854775807,
    cache: 1,
  }),
  enum: integer(),
  message: text(),
  cratedAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
});

export const users = pgTable("users", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "users_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 9223372036854775807,
    cache: 1,
  }),
  namaUser: varchar("nama_user").notNull(),
  email: varchar().notNull(),
  password: varchar(),
  refreshToken: varchar("refresh_token")
    .default("refresh_token_secret_key")
    .notNull(),
  telephoneNumber: varchar("telephone_number"),
  createdAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
  role: varchar().notNull(),
});

export const stokKaosKaki = pgTable(
  "stok_kaos_kaki",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "stok_kaos_kaki_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    idKaos: integer("id_kaos"),
    idUkuran: integer("id_ukuran"),
    idWarna: integer("id_warna"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    stok: bigint({ mode: "number" }),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.idKaos],
      foreignColumns: [kaosKaki.id],
      name: "stok_kaos_kaki_id_kaos_fkey",
    }),
    foreignKey({
      columns: [table.idUkuran],
      foreignColumns: [ukuran.id],
      name: "stok_kaos_kaki_id_ukuran_fkey",
    }),
    foreignKey({
      columns: [table.idWarna],
      foreignColumns: [warna.id],
      name: "stok_kaos_kaki_id_warna_fkey",
    }),
  ]
);

export const kaosKakiVariasiDetail = pgTable(
  "kaos_kaki_variasi_detail",
  {
    id: serial().primaryKey().notNull(),
    kaosKakiId: integer("kaos_kaki_id").notNull(),
    ukuranId: integer("ukuran_id").notNull(),
    warnaId: integer("warna_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.kaosKakiId],
      foreignColumns: [kaosKaki.id],
      name: "kaos_kaki_variasi_kaos_kaki_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.ukuranId],
      foreignColumns: [ukuran.id],
      name: "kaos_kaki_variasi_ukuran_id_fkey",
    }),
    foreignKey({
      columns: [table.warnaId],
      foreignColumns: [warna.id],
      name: "kaos_kaki_variasi_warna_id_fkey",
    }),
    unique("uk_variasi").on(table.kaosKakiId, table.ukuranId, table.warnaId),
  ]
);
