import { pgTable, foreignKey, unique, serial, varchar, integer, text, timestamp, boolean, check, bigint, uniqueIndex, uuid, jsonb, inet } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const kaosKaki = pgTable("kaos_kaki", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 255 }).notNull(),
	jenisBahanId: integer("jenis_bahan_id"),
	keterangan: text(),
	lastOrderDate: timestamp("last_order_date", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	kodeKaosKaki: text("kode_kaos_kaki"),
	status: integer(),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.jenisBahanId],
			foreignColumns: [jenisBahan.id],
			name: "kaos_kaki_jenis_bahan_id_fkey"
		}),
	unique("uk_nama_jenis").on(table.nama, table.jenisBahanId),
]);

export const jenisMesin = pgTable("jenis_mesin", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 255 }).notNull(),
	kodeMesin: text("kode_mesin"),
	status: integer().default(1),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	isDeleted: boolean().default(false),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("data_mesin_nama_key").on(table.nama),
]);

export const jenisBahan = pgTable("jenis_bahan", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 255 }).notNull(),
	kodeBahan: text("kode_bahan"),
	status: integer(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("jenis_bahan_nama_key").on(table.nama),
]);

export const jenisWarna = pgTable("jenis_warna", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 255 }).notNull(),
	kodeWarna: text("kode_warna"),
	status: integer(),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("warna_nama_key").on(table.nama),
]);

export const jenisUkuran = pgTable("jenis_ukuran", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 255 }).notNull(),
	kodeUkuran: text("kode_ukuran"),
	status: integer(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("ukuran_nama_key").on(table.nama),
]);

export const pesanan = pgTable("pesanan", {
	id: serial().primaryKey().notNull(),
	namaPemesan: varchar("nama_pemesan", { length: 255 }).notNull(),
	catatan: text(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	status: integer(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	noTelp: text("no_telp"),
});

export const kaosKakiDetailFoto = pgTable("kaos_kaki_detail_foto", {
	id: serial().primaryKey().notNull(),
	kaosKakiId: integer("kaos_kaki_id").notNull(),
	url: text().notNull(),
	isPrimary: boolean("is_primary").default(false),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.kaosKakiId],
			foreignColumns: [kaosKaki.id],
			name: "foto_kaos_kaki_kaos_kaki_id_fkey"
		}).onDelete("cascade"),
]);

export const pesananDetail = pgTable("pesanan_detail", {
	id: serial().primaryKey().notNull(),
	pesananId: integer("pesanan_id").notNull(),
	kaosKakiVariasiId: integer("kaos_kaki_variasi_id").notNull(),
	jumlah: integer().notNull(),
	hargaSatuan: integer("harga_satuan").notNull(),
	isDeleted: boolean().default(false),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.kaosKakiVariasiId],
			foreignColumns: [kaosKakiDetailVariasi.id],
			name: "pesanan_detail_kaos_kaki_variasi_id_fkey"
		}),
	foreignKey({
			columns: [table.pesananId],
			foreignColumns: [pesanan.id],
			name: "pesanan_detail_pesanan_id_fkey"
		}).onDelete("cascade"),
	check("pesanan_detail_harga_satuan_check", sql`(harga_satuan)::numeric > (0)::numeric`),
	check("pesanan_detail_jumlah_check", sql`jumlah > 0`),
]);

export const kaosKakiDetailMesin = pgTable("kaos_kaki_detail_mesin", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "data_mesin_id_seq1", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	kaosKakiId: integer("kaos_kaki_id"),
	jenisMesinId: integer("jenis_mesin_id"),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.jenisMesinId],
			foreignColumns: [jenisMesin.id],
			name: "data_mesin_jenis_mesin_id_fkey"
		}),
	foreignKey({
			columns: [table.kaosKakiId],
			foreignColumns: [kaosKaki.id],
			name: "data_mesin_kaos_kaki_id_fkey"
		}),
]);

export const status = pgTable("status", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "status_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	enum: integer(),
	message: text(),
	cratedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	namaUser: varchar("nama_user").notNull(),
	email: varchar().notNull(),
	password: varchar(),
	refreshToken: varchar("refresh_token").default('refresh_token_secret_key').notNull(),
	telephoneNumber: varchar("telephone_number"),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	role: varchar().notNull(),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("user_deleted_at_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")).where(sql`("deletedAt" IS NULL)`),
]);

export const auditLog = pgTable("audit_log", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tableName: text("table_name").notNull(),
	recordId: uuid("record_id").notNull(),
	action: text().notNull(),
	userId: uuid("user_id").notNull(),
	oldData: jsonb("old_data"),
	newData: jsonb("new_data"),
	occurredAt: timestamp("occurred_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	requestId: text("request_id"),
	ipAddress: inet("ip_address"),
	userAgent: text("user_agent"),
}, (table) => [
	check("audit_log_action_check", sql`action = ANY (ARRAY['CREATE'::text, 'UPDATE'::text, 'DELETE'::text, 'SOFT_DELETE'::text, 'RESTORE'::text])`),
]);

export const kaosKakiStok = pgTable("kaos_kaki_stok", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "stok_kaos_kaki_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	idKaos: integer("id_kaos"),
	idUkuran: integer("id_ukuran"),
	idWarna: integer("id_warna"),
	stok: integer(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	isDeleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.idKaos],
			foreignColumns: [kaosKaki.id],
			name: "stok_kaos_kaki_id_kaos_fkey"
		}),
	foreignKey({
			columns: [table.idUkuran],
			foreignColumns: [jenisUkuran.id],
			name: "stok_kaos_kaki_id_ukuran_fkey"
		}),
	foreignKey({
			columns: [table.idWarna],
			foreignColumns: [jenisWarna.id],
			name: "stok_kaos_kaki_id_warna_fkey"
		}),
]);

export const kaosKakiDetailVariasi = pgTable("kaos_kaki_detail_variasi", {
	id: serial().primaryKey().notNull(),
	kaosKakiId: integer("kaos_kaki_id").notNull(),
	ukuranId: integer("ukuran_id").notNull(),
	warnaId: integer("warna_id").notNull(),
	isDeleted: boolean().default(false),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.kaosKakiId],
			foreignColumns: [kaosKaki.id],
			name: "kaos_kaki_variasi_kaos_kaki_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.ukuranId],
			foreignColumns: [jenisUkuran.id],
			name: "kaos_kaki_variasi_ukuran_id_fkey"
		}),
	foreignKey({
			columns: [table.warnaId],
			foreignColumns: [jenisWarna.id],
			name: "kaos_kaki_variasi_warna_id_fkey"
		}),
	unique("uk_variasi").on(table.kaosKakiId, table.ukuranId, table.warnaId),
]);
