export const membersPage = {
  title: 'Membres',
  subtitle: 'Gérez les personnes qui ont accès à votre entreprise.',
  invite: 'Inviter un membre',
  loading: 'Chargement des membres…',
  empty: 'Aucun membre à afficher.',
  filter: 'Filtrer…',
  quota: {
    label: '{used} / {max} sièges',
    title: 'Sièges occupés (membres actifs + invitations en attente)',
    full: 'Quota atteint',
  },
  columns: {
    name: 'Nom',
    email: 'Email',
    role: 'Rôle',
    status: 'Statut',
    joinedAt: 'Arrivée',
    actions: 'Actions',
  },
  status: {
    active: 'Actif',
    inactive: 'Désactivé',
    pending: 'En attente',
  },
  changeRole: 'Changer le rôle',
  actions: {
    deactivate: 'Désactiver',
    reactivate: 'Réactiver',
    cancelInvitation: 'Annuler l’invitation',
  },
  deactivate: {
    title: 'Désactiver le membre',
    message: 'Désactiver {name} ? Son accès sera suspendu sans suppression du compte.',
    cancel: 'Annuler',
    confirm: 'Désactiver',
  },
};
