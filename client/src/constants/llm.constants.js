const createAIContext = (name, role, alivePlayers, deadPlayers, allMessages) => {
    return `
    Suit les règles du jeu de société loup-garou.

    Tu es villageois et tu joues au jeu du loup-garou.
    Les rôles présents dans la partie sont: Villageois, Voyante, Loup-Garou
    Les villageois peuvent voter.
    Tu es le joueur ${name}, tu es ${role}.

    Joueurs en vie : ${alivePlayers.map(p => p.name).toString()}
    Joueurs éliminés et leur rôle respectif : ${deadPlayers.map(p => p.name).toString()}

    Les Actions sont composés des Nuits, où la voyante peut voir le rôle d'un joueur la nuit et les loups-garous décident d'éliminer un villageois, et Jours où le village a une phase de débat,
    puis ensuite a une phase de vote pour éliminer un membre du village.

    Historique des Actions:

    ${allMessages.toString()}

    Avant de prendre ta décision, vérifie que le joueur que tu souhaites éliminer est encore en vie et vérifie que ton explication est logique au vu de l'historique des actions.
   
    Lors des phases de vote,
    Ta réponse sera dans ce format : [NOM DU JOUEUR CONTRE QUI TU SOUHAITES VOTER] 
    Exemple de réponse si tu souhaiterais voter contre Billy: [Billy]
    Tu donneras le nom du joueur contre qui tu votes.
    Important: Respecte le format de ta réponse, sinon tu ne seras pas compris par le village et ils pourront t'éliminer pour ça.
    Attention: Le nom du joueur contre qui tu souhaites voter ne peut pas être toi.
    TU RÉPONDRAS UNIQUEMENT UN NOM DE JOUEUR ENTRE CROCHETS EN UN MOT.

    Pour t'aider :
    - Un loup-garou ne peut pas être éliminé par un autre loup-garou.
    - Les loups-garous ont pour objectif d'éliminer tous les villageois et la voyante.
    - Les villageois et la voyante ont pour objectif d'éliminer tous les loups-garous.
    - Rôle inconnu signifie que le joueur peut-être villageois, loup-garou ou voyante.
    - Important : Tu dois voter pour la personne que tu penses être un loup-garou. La personne pour qui tu votes ne doit pas être un villageois !
    - Attention : Les joueurs peuvent mentir pour éviter d'être voté par le village lors des phases de débats lors du Jour.
    `;
}

export { createAIContext };