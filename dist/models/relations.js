"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jenisWarnaRelations = exports.jenisUkuranRelations = exports.kaosKakiStokRelations = exports.jenisMesinRelations = exports.kaosKakiDetailMesinRelations = exports.pesananRelations = exports.kaosKakiDetailVariasiRelations = exports.pesananDetailRelations = exports.kaosKakiDetailFotoRelations = exports.jenisBahanRelations = exports.kaosKakiRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const schema_1 = require("./schema");
exports.kaosKakiRelations = (0, relations_1.relations)(schema_1.kaosKaki, ({ one, many }) => ({
    jenisBahan: one(schema_1.jenisBahan, {
        fields: [schema_1.kaosKaki.jenisBahanId],
        references: [schema_1.jenisBahan.id],
    }),
    kaosKakiDetailFotos: many(schema_1.kaosKakiDetailFoto),
    kaosKakiDetailMesins: many(schema_1.kaosKakiDetailMesin),
    kaosKakiStoks: many(schema_1.kaosKakiStok),
    kaosKakiDetailVariasis: many(schema_1.kaosKakiDetailVariasi),
}));
exports.jenisBahanRelations = (0, relations_1.relations)(schema_1.jenisBahan, ({ many }) => ({
    kaosKakis: many(schema_1.kaosKaki),
}));
exports.kaosKakiDetailFotoRelations = (0, relations_1.relations)(schema_1.kaosKakiDetailFoto, ({ one }) => ({
    kaosKaki: one(schema_1.kaosKaki, {
        fields: [schema_1.kaosKakiDetailFoto.kaosKakiId],
        references: [schema_1.kaosKaki.id],
    }),
}));
exports.pesananDetailRelations = (0, relations_1.relations)(schema_1.pesananDetail, ({ one }) => ({
    kaosKakiDetailVariasi: one(schema_1.kaosKakiDetailVariasi, {
        fields: [schema_1.pesananDetail.kaosKakiVariasiId],
        references: [schema_1.kaosKakiDetailVariasi.id],
    }),
    pesanan: one(schema_1.pesanan, {
        fields: [schema_1.pesananDetail.pesananId],
        references: [schema_1.pesanan.id],
    }),
}));
exports.kaosKakiDetailVariasiRelations = (0, relations_1.relations)(schema_1.kaosKakiDetailVariasi, ({ one, many }) => ({
    pesananDetails: many(schema_1.pesananDetail),
    kaosKaki: one(schema_1.kaosKaki, {
        fields: [schema_1.kaosKakiDetailVariasi.kaosKakiId],
        references: [schema_1.kaosKaki.id],
    }),
    jenisUkuran: one(schema_1.jenisUkuran, {
        fields: [schema_1.kaosKakiDetailVariasi.ukuranId],
        references: [schema_1.jenisUkuran.id],
    }),
    jenisWarna: one(schema_1.jenisWarna, {
        fields: [schema_1.kaosKakiDetailVariasi.warnaId],
        references: [schema_1.jenisWarna.id],
    }),
}));
exports.pesananRelations = (0, relations_1.relations)(schema_1.pesanan, ({ many }) => ({
    pesananDetails: many(schema_1.pesananDetail),
}));
exports.kaosKakiDetailMesinRelations = (0, relations_1.relations)(schema_1.kaosKakiDetailMesin, ({ one }) => ({
    jenisMesin: one(schema_1.jenisMesin, {
        fields: [schema_1.kaosKakiDetailMesin.jenisMesinId],
        references: [schema_1.jenisMesin.id],
    }),
    kaosKaki: one(schema_1.kaosKaki, {
        fields: [schema_1.kaosKakiDetailMesin.kaosKakiId],
        references: [schema_1.kaosKaki.id],
    }),
}));
exports.jenisMesinRelations = (0, relations_1.relations)(schema_1.jenisMesin, ({ many }) => ({
    kaosKakiDetailMesins: many(schema_1.kaosKakiDetailMesin),
}));
exports.kaosKakiStokRelations = (0, relations_1.relations)(schema_1.kaosKakiStok, ({ one }) => ({
    kaosKaki: one(schema_1.kaosKaki, {
        fields: [schema_1.kaosKakiStok.idKaos],
        references: [schema_1.kaosKaki.id],
    }),
    jenisUkuran: one(schema_1.jenisUkuran, {
        fields: [schema_1.kaosKakiStok.idUkuran],
        references: [schema_1.jenisUkuran.id],
    }),
    jenisWarna: one(schema_1.jenisWarna, {
        fields: [schema_1.kaosKakiStok.idWarna],
        references: [schema_1.jenisWarna.id],
    }),
}));
exports.jenisUkuranRelations = (0, relations_1.relations)(schema_1.jenisUkuran, ({ many }) => ({
    kaosKakiStoks: many(schema_1.kaosKakiStok),
    kaosKakiDetailVariasis: many(schema_1.kaosKakiDetailVariasi),
}));
exports.jenisWarnaRelations = (0, relations_1.relations)(schema_1.jenisWarna, ({ many }) => ({
    kaosKakiStoks: many(schema_1.kaosKakiStok),
    kaosKakiDetailVariasis: many(schema_1.kaosKakiDetailVariasi),
}));
//# sourceMappingURL=relations.js.map