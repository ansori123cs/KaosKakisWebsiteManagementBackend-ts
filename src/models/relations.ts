import { relations } from "drizzle-orm/relations";
import {
  jenisBahan,
  kaosKaki,
  kaosKakiVariasiDetail,
  pesananDetail,
  pesanan,
  fotoKaosKaki,
  jenisMesin,
  dataMesin,
  stokKaosKaki,
  ukuran,
  warna,
} from "./schema.ts";

export const kaosKakiRelations = relations(kaosKaki, ({ one, many }) => ({
  jenisBahan: one(jenisBahan, {
    fields: [kaosKaki.jenisBahanId],
    references: [jenisBahan.id],
  }),
  fotoKaosKakis: many(fotoKaosKaki),
  dataMesins: many(dataMesin),
  stokKaosKakis: many(stokKaosKaki),
  kaosKakiVariasiDetails: many(kaosKakiVariasiDetail),
}));

export const jenisBahanRelations = relations(jenisBahan, ({ many }) => ({
  kaosKakis: many(kaosKaki),
}));

export const pesananDetailRelations = relations(pesananDetail, ({ one }) => ({
  kaosKakiVariasiDetail: one(kaosKakiVariasiDetail, {
    fields: [pesananDetail.kaosKakiVariasiId],
    references: [kaosKakiVariasiDetail.id],
  }),
  pesanan: one(pesanan, {
    fields: [pesananDetail.pesananId],
    references: [pesanan.id],
  }),
}));

export const kaosKakiVariasiDetailRelations = relations(
  kaosKakiVariasiDetail,
  ({ one, many }) => ({
    pesananDetails: many(pesananDetail),
    kaosKaki: one(kaosKaki, {
      fields: [kaosKakiVariasiDetail.kaosKakiId],
      references: [kaosKaki.id],
    }),
    ukuran: one(ukuran, {
      fields: [kaosKakiVariasiDetail.ukuranId],
      references: [ukuran.id],
    }),
    warna: one(warna, {
      fields: [kaosKakiVariasiDetail.warnaId],
      references: [warna.id],
    }),
  })
);

export const pesananRelations = relations(pesanan, ({ many }) => ({
  pesananDetails: many(pesananDetail),
}));

export const fotoKaosKakiRelations = relations(fotoKaosKaki, ({ one }) => ({
  kaosKaki: one(kaosKaki, {
    fields: [fotoKaosKaki.kaosKakiId],
    references: [kaosKaki.id],
  }),
}));

export const dataMesinRelations = relations(dataMesin, ({ one }) => ({
  jenisMesin: one(jenisMesin, {
    fields: [dataMesin.jenisMesinId],
    references: [jenisMesin.id],
  }),
  kaosKaki: one(kaosKaki, {
    fields: [dataMesin.kaosKakiId],
    references: [kaosKaki.id],
  }),
}));

export const jenisMesinRelations = relations(jenisMesin, ({ many }) => ({
  dataMesins: many(dataMesin),
}));

export const stokKaosKakiRelations = relations(stokKaosKaki, ({ one }) => ({
  kaosKaki: one(kaosKaki, {
    fields: [stokKaosKaki.idKaos],
    references: [kaosKaki.id],
  }),
  ukuran: one(ukuran, {
    fields: [stokKaosKaki.idUkuran],
    references: [ukuran.id],
  }),
  warna: one(warna, {
    fields: [stokKaosKaki.idWarna],
    references: [warna.id],
  }),
}));

export const ukuranRelations = relations(ukuran, ({ many }) => ({
  stokKaosKakis: many(stokKaosKaki),
  kaosKakiVariasiDetails: many(kaosKakiVariasiDetail),
}));

export const warnaRelations = relations(warna, ({ many }) => ({
  stokKaosKakis: many(stokKaosKaki),
  kaosKakiVariasiDetails: many(kaosKakiVariasiDetail),
}));
