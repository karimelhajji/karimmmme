import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# 1. Charger le fichier CSV
df = pd.read_csv("simulation_transition_2015_2050.csv")

# 2. Choisir une année
annee = st.slider("Année de simulation", int(df['Annee'].min()), int(df['Annee'].max()), 2025)
data = df[df['Annee'] == annee].squeeze()

st.title("🧮 Simulateur de transition écologique")
st.subheader(f"Année sélectionnée : {annee}")

# 3. Curseurs pour politiques publiques
tva = st.slider("TVA dédiée à la transition (%)", 0.0, 5.0, float(data['TVA_transition_%']))
cotisation = st.slider("Cotisation sociale (%)", 0.0, 5.0, float(data['Cotisation_sociale_%']))
taxe_capital = st.slider("Taxe sur le capital (%)", 0.0, 5.0, float(data['Taxe_capital_%']))

# 4. Calcul recettes publiques
recette_tva = data['PIB'] * (tva / 100)
recette_cotisation = data['PIB'] * (cotisation / 100)
recette_capital = data['PIB'] * (taxe_capital / 100)
recette_totale = recette_tva + recette_cotisation + recette_capital

# 5. Besoin de financement et green bonds
besoin = data['Besoin_transition_Mds€']
green_bonds = max(0, besoin - recette_totale)

# 6. Affichage des résultats
st.write(f"📊 PIB : {data['PIB']} Mds €")
st.write(f"👥 Population : {data['Population']} M")
st.write(f"🌍 GES : {data['GES']} MtCO2e")
st.write(f"📈 Besoin total de financement : {besoin:.2f} Mds €")
st.write(f"🏛️ Recettes publiques estimées : {recette_totale:.2f} Mds €")
st.write(f"🏦 Green Bonds nécessaires : {green_bonds:.2f} Mds €")

# 7. Graphique de répartition
st.subheader("Répartition du financement")
fig, ax = plt.subplots()
ax.pie([recette_totale, green_bonds], labels=["Public", "Privé (Green Bonds)"], autopct="%1.1f%%", colors=["green", "gray"])
st.pyplot(fig)