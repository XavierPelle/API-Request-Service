# 🛠️ **API Request Service** 🚀

## ✨ **Un outil React pour tester des API avec des requêtes répétées et des graphiques de résultats**

Un outil puissant et simple à utiliser pour effectuer des requêtes API avec plusieurs itérations, puis analyser les résultats via des graphiques interactifs et des résumés détaillés. Idéal pour les tests de performance et de fiabilité des API.

---

## 📦 **Prérequis**

Avant de commencer, assurez-vous que vous avez installé Docker sur votre machine.

### 📍 **Prérequis principaux**

- **[Docker](https://www.docker.com/)** - Conteneurisation de l'application pour faciliter le déploiement.

---

## 🚀 **Installation & Lancement avec Docker**

### 🔧 **Étapes d'installation**

1. **Clonez le projet depuis GitHub :**

   ```bash
   git clone https://github.com/XavierPelle/API-Request-Service
   cd api-request-service
   docker-compose up -d
    ```
2. **Démarrer le projet:**

   ```bash
   docker-compose up -d
   http://localhost:3000/
    ```

## 🧩 Fonctionnement des Middlewares

L’application prend en charge des **middlewares personnalisés** pour enrichir, transformer ou surveiller dynamiquement le payload des requêtes API.  
Ce système flexible permet de **modifier, ajouter ou observer** les données envoyées à chaque requête, facilitant ainsi l’automatisation de scénarios complexes ou l’enrichissement de vos tests API.

---

## 📁 Structure des Middlewares

- Tous les middlewares doivent être placés dans le dossier `middleware/`.
- Chaque middleware est un fichier `.js` qui **exporte une fonction du même nom que le fichier**.


---

### ⚙️ Comportement attendu

- **Paramètre d’entrée :** chaque middleware reçoit en paramètre le body d’origine de la requête (objet JavaScript).
- **Retour possible :**
  - Ne rien retourner (utile pour du logging, de l’observation, etc.).
  - Retourner une valeur (objet, tableau, chaîne, etc.).
- **Fusion automatique :** si une valeur est retournée, elle est fusionnée avec le payload original avant l’envoi de la requête.

---

### 🔄 Enchaînement des middlewares

- Plusieurs middlewares peuvent être déclarés pour une même requête.
- Ils sont exécutés dans l’ordre de déclaration.
- Si un middleware est asynchrone (`async`), il sera attendu (`await`) avant de passer au suivant.
- Chaque résultat retourné est fusionné dans le body final envoyé à l’API.
