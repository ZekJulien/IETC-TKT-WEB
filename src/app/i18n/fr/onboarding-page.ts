export const onboardingPage = {
  tagline: 'Bienvenue. Configurons votre espace.',
  back: 'Retour',
  steps: {
    verify: 'Email vérifié',
    choice: 'Votre espace',
    setup: 'Configuration',
  },
  choice: {
    title: 'Configurez votre espace de travail',
    subtitle: 'Créez votre entreprise ou rejoignez une équipe existante.',
    create: {
      title: 'Créer une entreprise',
      desc: 'Démarrez un nouvel espace et invitez votre équipe.',
    },
    join: {
      title: 'J’ai reçu une invitation',
      desc: 'Rejoignez une entreprise avec votre code d’invitation.',
    },
  },
  create: {
    title: 'Créer votre entreprise',
    subtitle: 'Ces informations identifient votre espace de travail.',
    nameLabel: 'Nom de l’entreprise',
    namePlaceholder: 'Acme inc.',
    slugLabel: 'Identifiant',
    slugPlaceholder: 'acme-inc',
    slugFallback: 'votre-entreprise',
    previewLabel: 'Adresse de votre espace',
    previewBase: 'tkt.app/',
    submit: 'Créer l’entreprise',
  },
  join: {
    title: 'Rejoindre une entreprise',
    subtitle: 'Saisissez le code d’invitation reçu par email.',
    codeLabel: 'Code d’invitation',
    codePlaceholder: 'XXXX-XXXX-XXXX',
    submit: 'Rejoindre',
  },
};
