import { useEffect } from "react";

function SectionCard({ title, children }) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-4">
      <h2 className="text-2xl font-bold font-techno text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 dark:bg-gray-800 my-10" />;
}

export default function Learn() {
  useEffect(() => {
    document.title = "Comprendre | Crypto & Blockchain";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black px-4 sm:px-6 py-10">
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Comprendre la blockchain
          </h1>
        </div>

        {/* Section : Qu’est-ce que la blockchain ? */}
        <SectionCard
          title={
            <>
              Qu’est-ce que la <em>blockchain</em> ?
            </>
          }
        >
          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Tout d'abord, la <strong>blockchain</strong> est une technologie de
            stockage et de transmission d’informations. C'est un registre partagé,
            distribué et sécurisé, accessible à tous les participants d'un même réseau.
            <br />
            C'est comme un grand livre numérique, qu'on ne peut pas falsifier et
            qui est transparent.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Dans la blockchain, des « blocs » contiennent des transactions
            reliées entre eux via des hachages cryptographiques. Cette façon de crypter crée une chaîne
            infalsifiable.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Le consensus entre les participants (Proof-of-Work ou Proof-of-Stake)
            permet de valider les blocs et d’ajouter de nouvelles transactions
            de manière sûre.
          </p>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-4">
            <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
              Voici quelques avantages pertinents de cette technologie:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3 text-sm sm:text-base text-gray-900 dark:text-gray-100">
              <li>Transparence des transactions.</li>
              <li>Sécurité renforcée grâce à l'enchaînement des blocs.</li>
              <li>Décentralisation. Il n'ya pas d'autorité centrale comme dans le systeme traditonnel bancaire</li>
              <li>Immutabilité des données validées. On ne peut pas les modifier</li>
              <li>Multiples usages dans differents domaines : crypto-monnaies et la traçabilité.</li>
            </ul>
          </div>
        </SectionCard>

        <Divider />

        {/* Section : Qu’est-ce qu’un bloc ? */}
        <SectionCard title="Qu’est-ce qu’un bloc ?">
          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Un <strong>bloc</strong> est une unité de données regroupant des
            transactions et des métadonnées comme un horodatage, en se référant
            toujours au bloc précédent.
            <br />
            Son rôle est d'assurer l’intégrité du réseau via le hachage
            cryptographique.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Le premier bloc d’une blockchain s’appelle le <em>bloc de genèse</em>.
          </p>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-4">
            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
              Le rôle d’un bloc :
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3 text-sm sm:text-base text-gray-900 dark:text-gray-100">
              <li>Conserver l’historique des transactions.</li>
              <li>Garantir la sécurité via l’enchaînement des hachages.</li>
              <li>Permettre à tous les ordinateurs du réseau d’avoir la même version des transactions et d’être d’accord sur ce qui est vrai.</li>
            </ul>
          </div>
        </SectionCard>

        <Divider />

        {/* Section : Comment les transactions sont validées ? */}
        <SectionCard title="Comment les transactions sont validées ?">
          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Lorsqu’une transaction est envoyée, elle est diffusée à tout le réseau.
            Les <strong>nœuds</strong> vérifient sa validité et la disponibilité
            des fonds ($) avant de l’ajouter à un bloc. 
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Ensuite, les transactions sont regroupées dans un bloc en attente de
            validation. Les mineurs ou validateurs examinent ces transactions et
            les intègrent dans un nouveau bloc. 
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Le réseau doit ensuite valider en procédant à un consensus (PoW ou POS) pour ajouter le bloc à
            la blockchain.
          </p>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-4">
            <ul className="list-disc ml-6 space-y-2 text-sm sm:text-base text-gray-900 dark:text-gray-100">
              <li>
                <strong>Proof-of-Work (PoW)</strong> : résoudre un calcul complexe à l'aide d'un ordinateur puissant
                pour prouver qu’on a dépensé de l’énergie afin de valider un bloc.
              </li>
              <li>
                <strong>Proof-of-Stake (PoS)</strong> : les mineurs/validateurs sont choisis
                selon la crypto qu’ils ont mise en jeu et qu'ils ont bloqué une certaine quantité en guise de garantie. 
                <br />
                Plus leur mise est importante, plus ils ont de chances d’être choisis pour créer un nouveau bloc et recevoir une récompense. 
                <br />
                Il est important de savoir que ce consensus est moins énergivore que le PoW mais prend plus d'effort pour être mis en place.
              </li>
            </ul>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Chaque bloc contient le hash du précédent. Cela garanti que toute
            modification serait immédiatement détectée.
          </p>
        </SectionCard>

        <Divider />

        {/* Section : Sécurité & Hachage */}
        <SectionCard title="Sécurité & Hachage">
          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            La sécurité repose principalement sur le <strong>hachage cryptographique</strong>. Un
            hash transforme une donnée en empreinte unique et irréversible. Un exemple est donné par la fonction SHA-256 utilisée dans Bitcoin. Dans mon site, j'utilise une version simplifiée pour des raisons pédagogiques.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Un hash agit comme l’empreinte digitale d’un bloc, qui contient aussi
            le hash du bloc précédent. Ainsi, une chaîne est crée où chaque élément dépend
            du précédent.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-gray-100">
            Si quelqu’un modifie une transaction, le hash change et invalide la
            chaîne après ce point. Cela assure l’immutabilité, la propriété de ce qui ne peut être changé.
          </p>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-4">
            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
              Le hachage est une technique très efficace qui permet de :
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3 text-sm sm:text-base text-gray-900 dark:text-gray-100">
              <li>Identifier chaque bloc de manière unique.</li>
              <li>Créer un lien sécurisé entre les blocs.</li>
              <li>Rendre la blockchain impossible à falsifier.</li>
              <li>Assurer l’immutabilité des données validées.</li>
            </ul>
          </div>
        </SectionCard>

        <Divider />
      </div>
    </div>
  );
}
