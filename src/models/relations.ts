import { relations } from "drizzle-orm/relations";
import {
  jenisBahan,
  kaosKaki,
  kaosKakiDetailFoto,
  kaosKakiDetailVariasi,
  pesananDetail,
  pesanan,
  jenisMesin,
  kaosKakiDetailMesin,
  jenisUkuran,
  jenisWarna,
  kaosKakiStok,
} from "./schema.ts";

export const kaosKakiRelations = relations(kaosKaki, ({ one, many }) => ({
  jenisBahan: one(jenisBahan, {
    fields: [kaosKaki.jenisBahanId],
    references: [jenisBahan.id],
  }),
  kaosKakiDetailFotos: many(kaosKakiDetailFoto),
  kaosKakiDetailMesins: many(kaosKakiDetailMesin),
  kaosKakiDetailVariasis: many(kaosKakiDetailVariasi),
  kaosKakiStoks: many(kaosKakiStok),
}));

export const jenisBahanRelations = relations(jenisBahan, ({ many }) => ({
  kaosKakis: many(kaosKaki),
}));

export const kaosKakiDetailFotoRelations = relations(
  kaosKakiDetailFoto,
  ({ one }) => ({
    kaosKaki: one(kaosKaki, {
      fields: [kaosKakiDetailFoto.kaosKakiId],
      references: [kaosKaki.id],
    }),
  })
);

export const pesananDetailRelations = relations(pesananDetail, ({ one }) => ({
  kaosKakiDetailVariasi: one(kaosKakiDetailVariasi, {
    fields: [pesananDetail.kaosKakiVariasiId],
    references: [kaosKakiDetailVariasi.id],
  }),
  pesanan: one(pesanan, {
    fields: [pesananDetail.pesananId],
    references: [pesanan.id],
  }),
}));

export const kaosKakiDetailVariasiRelations = relations(
  kaosKakiDetailVariasi,
  ({ one, many }) => ({
    pesananDetails: many(pesananDetail),
    kaosKaki: one(kaosKaki, {
      fields: [kaosKakiDetailVariasi.kaosKakiId],
      references: [kaosKaki.id],
    }),
    jenisUkuran: one(jenisUkuran, {
      fields: [kaosKakiDetailVariasi.ukuranId],
      references: [jenisUkuran.id],
    }),
    jenisWarna: one(jenisWarna, {
      fields: [kaosKakiDetailVariasi.warnaId],
      references: [jenisWarna.id],
    }),
  })
);

export const pesananRelations = relations(pesanan, ({ many }) => ({
  pesananDetails: many(pesananDetail),
}));

export const kaosKakiDetailMesinRelations = relations(
  kaosKakiDetailMesin,
  ({ one }) => ({
    jenisMesin: one(jenisMesin, {
      fields: [kaosKakiDetailMesin.jenisMesinId],
      references: [jenisMesin.id],
    }),
    kaosKaki: one(kaosKaki, {
      fields: [kaosKakiDetailMesin.kaosKakiId],
      references: [kaosKaki.id],
    }),
  })
);

export const jenisMesinRelations = relations(jenisMesin, ({ many }) => ({
  kaosKakiDetailMesins: many(kaosKakiDetailMesin),
}));

export const jenisUkuranRelations = relations(jenisUkuran, ({ many }) => ({
  kaosKakiDetailVariasis: many(kaosKakiDetailVariasi),
  kaosKakiStoks: many(kaosKakiStok),
}));

export const jenisWarnaRelations = relations(jenisWarna, ({ many }) => ({
  kaosKakiDetailVariasis: many(kaosKakiDetailVariasi),
  kaosKakiStoks: many(kaosKakiStok),
}));

export const kaosKakiStokRelations = relations(kaosKakiStok, ({ one }) => ({
  kaosKaki: one(kaosKaki, {
    fields: [kaosKakiStok.idKaos],
    references: [kaosKaki.id],
  }),
  jenisUkuran: one(jenisUkuran, {
    fields: [kaosKakiStok.idUkuran],
    references: [jenisUkuran.id],
  }),
  jenisWarna: one(jenisWarna, {
    fields: [kaosKakiStok.idWarna],
    references: [jenisWarna.id],
  }),
}));
