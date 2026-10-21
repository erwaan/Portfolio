# Le projet
Une application web locale pour jouer à une adaptation du jeu « Alibi », popularisé par les vidéos YouTube de Squeezie. Deux duos de suspects s'affrontent dans une épreuve de mémoire et de complicité : pour s'innocenter, les deux membres d'un duo doivent raconter exactement la même version de leur alibi, sans pouvoir se concerter.

# Comment ça marche ?
Chaque duo reçoit un alibi d'une page, écrit et imprimé à l'avance, et dispose d'un temps limité pour le lire ensemble. Il faut retenir un maximum de détails, mais aussi anticiper les zones d'ombre et se mettre d'accord sur ce qui n'est pas écrit.

Une fois le temps écoulé, les deux coéquipiers sont séparés dans deux pièces pour l'interrogatoire. Dans chaque pièce, un inspecteur lit la question affichée par l'application, puis saisit la réponse du suspect. Si les deux réponses concordent, le duo marque un point. Sinon, l'application lance un court appel vidéo entre les deux pièces : les coéquipiers se voient quelques secondes pour s'expliquer sur leur incohérence, ce qui donne souvent des situations très drôles.

Quand les deux duos sont passés, l'application fait le total des points et annonce le gagnant.

# Outil et techno
Python, flask, html/css/js, WebRTC