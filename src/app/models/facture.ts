export interface Facture {
  id?: number;

  numeroFacture: string;

  dateFacture: string;

  dateEcheance: string;

  montantHT: number;

  tva: number;

  montantTTC?: number;

  statut: string;

  bonLivraison: {
    id: number;
    numeroBon?: string;

    commande?: {
      id?: number;
      numeroCommande?: string;

      marche?: {
        id?: number;
        numeroMarche?: string;
      };
    };
  };
}
