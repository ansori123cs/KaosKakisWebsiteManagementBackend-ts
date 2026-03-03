"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kaosKakiDetailVariasi = exports.kaosKakiStok = exports.auditLog = exports.users = exports.status = exports.kaosKakiDetailMesin = exports.pesananDetail = exports.kaosKakiDetailFoto = exports.pesanan = exports.jenisUkuran = exports.jenisWarna = exports.jenisBahan = exports.jenisMesin = exports.kaosKaki = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.kaosKaki = (0, pg_core_1.pgTable)("kaos_kaki", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    nama: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    jenisBahanId: (0, pg_core_1.integer)("jenis_bahan_id"),
    keterangan: (0, pg_core_1.text)(),
    lastOrderDate: (0, pg_core_1.timestamp)("last_order_date", { withTimezone: true, mode: 'string' }),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    kodeKaosKaki: (0, pg_core_1.text)("kode_kaos_kaki"),
    status: (0, pg_core_1.integer)(),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.jenisBahanId],
        foreignColumns: [exports.jenisBahan.id],
        name: "kaos_kaki_jenis_bahan_id_fkey"
    }),
    (0, pg_core_1.unique)("uk_nama_jenis").on(table.nama, table.jenisBahanId),
]);
exports.jenisMesin = (0, pg_core_1.pgTable)("jenis_mesin", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    nama: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    kodeMesin: (0, pg_core_1.text)("kode_mesin"),
    status: (0, pg_core_1.integer)().default(1),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    isDeleted: (0, pg_core_1.boolean)().default(false),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.unique)("data_mesin_nama_key").on(table.nama),
]);
exports.jenisBahan = (0, pg_core_1.pgTable)("jenis_bahan", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    nama: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    kodeBahan: (0, pg_core_1.text)("kode_bahan"),
    status: (0, pg_core_1.integer)(),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.unique)("jenis_bahan_nama_key").on(table.nama),
]);
exports.jenisWarna = (0, pg_core_1.pgTable)("jenis_warna", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    nama: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    kodeWarna: (0, pg_core_1.text)("kode_warna"),
    status: (0, pg_core_1.integer)(),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.unique)("warna_nama_key").on(table.nama),
]);
exports.jenisUkuran = (0, pg_core_1.pgTable)("jenis_ukuran", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    nama: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    kodeUkuran: (0, pg_core_1.text)("kode_ukuran"),
    status: (0, pg_core_1.integer)(),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.unique)("ukuran_nama_key").on(table.nama),
]);
exports.pesanan = (0, pg_core_1.pgTable)("pesanan", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    namaPemesan: (0, pg_core_1.varchar)("nama_pemesan", { length: 255 }).notNull(),
    catatan: (0, pg_core_1.text)(),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow(),
    status: (0, pg_core_1.integer)(),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow(),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    noTelp: (0, pg_core_1.text)("no_telp"),
});
exports.kaosKakiDetailFoto = (0, pg_core_1.pgTable)("kaos_kaki_detail_foto", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    kaosKakiId: (0, pg_core_1.integer)("kaos_kaki_id").notNull(),
    url: (0, pg_core_1.text)().notNull(),
    isPrimary: (0, pg_core_1.boolean)("is_primary").default(false),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.kaosKakiId],
        foreignColumns: [exports.kaosKaki.id],
        name: "foto_kaos_kaki_kaos_kaki_id_fkey"
    }).onDelete("cascade"),
]);
exports.pesananDetail = (0, pg_core_1.pgTable)("pesanan_detail", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    pesananId: (0, pg_core_1.integer)("pesanan_id").notNull(),
    kaosKakiVariasiId: (0, pg_core_1.integer)("kaos_kaki_variasi_id").notNull(),
    jumlah: (0, pg_core_1.integer)().notNull(),
    hargaSatuan: (0, pg_core_1.integer)("harga_satuan").notNull(),
    isDeleted: (0, pg_core_1.boolean)().default(false),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.kaosKakiVariasiId],
        foreignColumns: [exports.kaosKakiDetailVariasi.id],
        name: "pesanan_detail_kaos_kaki_variasi_id_fkey"
    }),
    (0, pg_core_1.foreignKey)({
        columns: [table.pesananId],
        foreignColumns: [exports.pesanan.id],
        name: "pesanan_detail_pesanan_id_fkey"
    }).onDelete("cascade"),
    (0, pg_core_1.check)("pesanan_detail_harga_satuan_check", (0, drizzle_orm_1.sql) `(harga_satuan)::numeric > (0)::numeric`),
    (0, pg_core_1.check)("pesanan_detail_jumlah_check", (0, drizzle_orm_1.sql) `jumlah > 0`),
]);
exports.kaosKakiDetailMesin = (0, pg_core_1.pgTable)("kaos_kaki_detail_mesin", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: (0, pg_core_1.bigint)({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "data_mesin_id_seq1", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    kaosKakiId: (0, pg_core_1.integer)("kaos_kaki_id"),
    jenisMesinId: (0, pg_core_1.integer)("jenis_mesin_id"),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow(),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.jenisMesinId],
        foreignColumns: [exports.jenisMesin.id],
        name: "data_mesin_jenis_mesin_id_fkey"
    }),
    (0, pg_core_1.foreignKey)({
        columns: [table.kaosKakiId],
        foreignColumns: [exports.kaosKaki.id],
        name: "data_mesin_kaos_kaki_id_fkey"
    }),
]);
exports.status = (0, pg_core_1.pgTable)("status", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: (0, pg_core_1.bigint)({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "status_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    enum: (0, pg_core_1.integer)(),
    message: (0, pg_core_1.text)(),
    cratedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow(),
});
exports.users = (0, pg_core_1.pgTable)("users", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: (0, pg_core_1.bigint)({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    namaUser: (0, pg_core_1.varchar)("nama_user").notNull(),
    email: (0, pg_core_1.varchar)().notNull(),
    password: (0, pg_core_1.varchar)(),
    refreshToken: (0, pg_core_1.varchar)("refresh_token").default('refresh_token_secret_key').notNull(),
    telephoneNumber: (0, pg_core_1.varchar)("telephone_number"),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow(),
    role: (0, pg_core_1.varchar)().notNull(),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("user_deleted_at_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")).where((0, drizzle_orm_1.sql) `("deletedAt" IS NULL)`),
]);
exports.auditLog = (0, pg_core_1.pgTable)("audit_log", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey().notNull(),
    tableName: (0, pg_core_1.text)("table_name").notNull(),
    recordId: (0, pg_core_1.uuid)("record_id").notNull(),
    action: (0, pg_core_1.text)().notNull(),
    userId: (0, pg_core_1.uuid)("user_id").notNull(),
    oldData: (0, pg_core_1.jsonb)("old_data"),
    newData: (0, pg_core_1.jsonb)("new_data"),
    occurredAt: (0, pg_core_1.timestamp)("occurred_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    requestId: (0, pg_core_1.text)("request_id"),
    ipAddress: (0, pg_core_1.inet)("ip_address"),
    userAgent: (0, pg_core_1.text)("user_agent"),
}, (table) => [
    (0, pg_core_1.check)("audit_log_action_check", (0, drizzle_orm_1.sql) `action = ANY (ARRAY['CREATE'::text, 'UPDATE'::text, 'DELETE'::text, 'SOFT_DELETE'::text, 'RESTORE'::text])`),
]);
exports.kaosKakiStok = (0, pg_core_1.pgTable)("kaos_kaki_stok", {
    id: (0, pg_core_1.integer)().primaryKey().generatedByDefaultAsIdentity({ name: "stok_kaos_kaki_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
    idKaos: (0, pg_core_1.integer)("id_kaos"),
    idUkuran: (0, pg_core_1.integer)("id_ukuran"),
    idWarna: (0, pg_core_1.integer)("id_warna"),
    stok: (0, pg_core_1.integer)(),
    createdAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    isDeleted: (0, pg_core_1.boolean)(),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.idKaos],
        foreignColumns: [exports.kaosKaki.id],
        name: "stok_kaos_kaki_id_kaos_fkey"
    }),
    (0, pg_core_1.foreignKey)({
        columns: [table.idUkuran],
        foreignColumns: [exports.jenisUkuran.id],
        name: "stok_kaos_kaki_id_ukuran_fkey"
    }),
    (0, pg_core_1.foreignKey)({
        columns: [table.idWarna],
        foreignColumns: [exports.jenisWarna.id],
        name: "stok_kaos_kaki_id_warna_fkey"
    }),
]);
exports.kaosKakiDetailVariasi = (0, pg_core_1.pgTable)("kaos_kaki_detail_variasi", {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    kaosKakiId: (0, pg_core_1.integer)("kaos_kaki_id").notNull(),
    ukuranId: (0, pg_core_1.integer)("ukuran_id").notNull(),
    warnaId: (0, pg_core_1.integer)("warna_id").notNull(),
    isDeleted: (0, pg_core_1.boolean)().default(false),
    deletedAt: (0, pg_core_1.timestamp)({ withTimezone: true, mode: 'string' }),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.kaosKakiId],
        foreignColumns: [exports.kaosKaki.id],
        name: "kaos_kaki_variasi_kaos_kaki_id_fkey"
    }).onDelete("cascade"),
    (0, pg_core_1.foreignKey)({
        columns: [table.ukuranId],
        foreignColumns: [exports.jenisUkuran.id],
        name: "kaos_kaki_variasi_ukuran_id_fkey"
    }),
    (0, pg_core_1.foreignKey)({
        columns: [table.warnaId],
        foreignColumns: [exports.jenisWarna.id],
        name: "kaos_kaki_variasi_warna_id_fkey"
    }),
    (0, pg_core_1.unique)("uk_variasi").on(table.kaosKakiId, table.ukuranId, table.warnaId),
]);
//# sourceMappingURL=schema.js.map