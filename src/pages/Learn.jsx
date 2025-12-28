import { useEffect } from "react";
export default function Learn() {
  useEffect(() => {
    document.title = "Comprendre | Crypto & Blockchain";
  }, []);
  return (
    <div>
      <h1 className="text-2xl text-center font-bold mb-4">
        Comprendre la blockchain
      </h1>

      {/* Section : Qu’est-ce que la blockchain ? */}
      <section className="space-y-4 p-10 mb-10 bg-white dark:bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold font-techno text-primary">
          Qu’est-ce que la <em>blockchain</em> ?
        </h2>
        <p>
          Tout d'abord, la <strong>blockchain</strong> est une technologie de
          stockage et de transmission d’informations. C'est un registre partagé,
          distribué et sécurisé, accessible à tous les participants du réseau.
          <br />
          C'est comme un grand livre numérique, qu'on ne peut pas falsifier et
          qui est transparent.
        </p>
        <p>
          Au cœur de la blockchain, des « blocs » contiennent des transactions
          reliées entre eux via des hachages cryptographiques, créant une chaîne
          infalsifiable.
        </p>
        <p>
          Le consensus entre les participants (Proof-of-Work ou Proof-of-Stake)
          permet de valider les blocs et d’ajouter de nouvelles transactions
          de manière sûre.
        </p>
        <p>Voici quelques avantages pertinents :</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Transparence des transactions.</li>
          <li>Sécurité renforcée grâce à l'enchaînement des blocs.</li>
          <li>Décentralisation, sans autorité centrale.</li>
          <li>Immutabilité des données validées.</li>
          <li>Multiples usages : crypto-monnaies, traçabilité, tokenisation, etc.</li>
        </ul>
      </section>

      {/* Section : Qu’est-ce qu’un bloc ? */}
      <section className="space-y-4 p-10 mb-10 bg-white dark:bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold font-techno text-primary">
          Qu’est-ce qu’un bloc ?
        </h2>
        <p>
          Un <strong>bloc</strong> est une unité de données regroupant des
          transactions et des métadonnées comme un horodatage, en se référant
          toujours au bloc précédent.
          <br />
          Son rôle est d'assurer l’intégrité du réseau via le hachage
          cryptographique.
        </p>
        <p>
          Le premier bloc d’une blockchain s’appelle le <em>bloc de genèse</em>.
        </p>
        <p>Le rôle d’un bloc :</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Conserver l’historique des transactions.</li>
          <li>Garantir la sécurité via l’enchaînement des hachages.</li>
          <li>Permettre à tous les nœuds d’avoir la même « vérité » partagée.</li>
        </ul>
      </section>

      {/* Section : Comment les transactions sont validées ? */}
      <section className="space-y-4 p-10 mb-10 bg-white dark:bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold font-techno text-primary">
          Comment les transactions sont validées ?
        </h2>
        <p>
          Lorsqu’une transaction est envoyée, elle est diffusée à tout le réseau.
          Les <strong>nœuds</strong> vérifient sa validité et la disponibilité
          des fonds.
        </p>
        <p>
          Ensuite, les transactions sont regroupées dans un bloc en attente de
          validation. Les mineurs ou validateurs examinent ces transactions et
          les intègrent dans un nouveau bloc.
        </p>
        <p>
          Le réseau doit ensuite parvenir à un consensus pour ajouter le bloc à
          la blockchain.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Proof-of-Work (PoW)</strong> : résoudre un calcul complexe
            pour prouver qu’on a dépensé de l’énergie afin de valider un bloc.
          </li>
          <li>
            <strong>Proof-of-Stake (PoS)</strong> : les validateurs sont choisis
            selon la crypto qu’ils ont mise en jeu, moins énergivore que PoW.
          </li>
        </ul>
        <p>
          Chaque bloc contient le hash du précédent, garantissant que toute
          modification serait immédiatement détectée.
        </p>
      </section>

      {/* Section : Sécurité & Hachage */}
      <section className="space-y-4 p-10 mb-10 bg-white dark:bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold font-techno text-primary">
          Sécurité & Hachage
        </h2>
        <p>
          La sécurité repose sur le <strong>hachage cryptographique</strong>. Un
          hash transforme une donnée en empreinte unique et irréversible.
        </p>
        <p>
          Un hash agit comme l’empreinte digitale d’un bloc, qui contient aussi
          le hash du bloc précédent, créant une chaîne où chaque élément dépend
          du précédent.
        </p>
        <p>
          Si quelqu’un modifie une transaction, le hash change et invalide la
          chaîne après ce point, assurant l’immutabilité.
        </p>
        <p className="font-semibold">Le hachage permet de :</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Identifier chaque bloc de manière unique.</li>
          <li>Créer un lien sécurisé entre les blocs.</li>
          <li>Rendre la blockchain quasi impossible à falsifier.</li>
          <li>Assurer l’immutabilité des données validées.</li>
        </ul>
      </section>
    </div>
  );
}
