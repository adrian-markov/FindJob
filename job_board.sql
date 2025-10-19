-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 07 oct. 2025 à 13:44
-- Version du serveur : 8.0.43-0ubuntu0.24.04.2
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `job_board`
--

-- --------------------------------------------------------

--
-- Structure de la table `Application`
--

CREATE TABLE `Application` (
  `id_application` int NOT NULL,
  `id_ad` int DEFAULT NULL,
  `id_applicant` int DEFAULT NULL,
  `message` text,
  `date_applied` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `cv_url` varchar(255) DEFAULT NULL,
  `email_sent` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Company`
--

CREATE TABLE `Company` (
  `id_company` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `website` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `sector` varchar(100) DEFAULT NULL,
  `email_contact` varchar(100) DEFAULT NULL,
  `logo_url` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Company`
--

INSERT INTO `Company` (`id_company`, `name`, `description`, `website`, `address`, `sector`, `email_contact`, `logo_url`) VALUES
(1, 'CloudTech', 'Entreprise tech spécialisée dans le cloud', 'https://cloudtech.com', 'Nantes', 'Informatique', 'contact@cloudtech.com', 'logo1.png'),
(2, 'Google', 'Google est une entreprise technologique multinationale fondée en 1998 par Larry Page et Sergey Brin. Elle est aujourd\'hui une filiale du groupe Alphabet Inc. et l\'un des leaders mondiaux dans le domaine du numérique et de l\'innovation. Basée à Mountain View, en Californie, Google développe des produits et services qui touchent des milliards d\'utilisateurs à travers le monde : moteur de recherche, YouTube, Android, Chrome, Google Cloud, ou encore Google Ads.  \r\n  Sa mission est d\'organiser l\'information à l\'échelle mondiale afin de la rendre universellement accessible et utile. L\'entreprise met un accent fort sur la recherche, l\'intelligence artificielle, la conception de produits intuitifs et l\'expérience utilisateur.  \r\n  En France, Google est implantée à Paris et collabore activement avec l\'écosystème technologique et entrepreneurial local pour soutenir l\'innovation et la transformation numérique.', 'https://about.google/', 'Paris, France ', 'Technologie ', 'recrutement@google.com', 'logo2.png'),
(3, 'TechEase', 'Entreprise de services informatiques fournissant du support technique, de la maintenance et de l’assistance utilisateur aux entreprises de toutes tailles.', 'https://techease.fr', '8 allée des Tanneurs, 44000 Nantes', 'Informatique / Support', 'support@techease.fr', 'techease_logo.png'),
(4, 'MarketEdge', 'Agence de marketing spécialisée dans les stratégies de marque et les campagnes digitales à fort impact. Elle aide les entreprises à accroître leur visibilité et leur notoriété.', 'https://marketedge.fr', '21 cours de l’Intendance, 33000 Bordeaux', 'Marketing / Communication', 'contact@marketedge.fr', 'marketedge_logo.png'),
(5, 'DataPulse', 'Société d’analyse de données et de conseil en business intelligence. Elle accompagne les organisations dans la valorisation de leurs données grâce à des outils analytiques modernes.', 'https://datapulse.fr', '99 avenue du Peuple Belge, 59800 Lille', 'Data / Conseil', 'info@datapulse.fr', 'datapulse_logo.png'),
(6, 'DesignFlow', 'Studio de design spécialisé dans la création d’interfaces web et mobiles intuitives et modernes. Il place l’expérience utilisateur au cœur de sa démarche créative.', 'https://designflow.fr', '14 boulevard Baille, 13006 Marseille', 'Design / UX-UI', 'hello@designflow.fr', 'designflow_logo.png'),
(7, 'Financia', 'Cabinet d’expertise comptable et de conseil financier intervenant auprès de TPE, PME et associations. Il accompagne ses clients dans la gestion quotidienne et la stratégie à long terme.', 'https://financia.fr', '25 rue du Languedoc, 31000 Toulouse', 'Comptabilité / Finance', 'contact@financia.fr', 'financia_logo.png'),
(8, 'CloudForge', 'Entreprise spécialisée dans le DevOps et l’automatisation d’infrastructures cloud. Elle conçoit des solutions robustes et sécurisées pour les entreprises du secteur technologique.', 'https://cloudforge.io', '50 rue de Rivoli, 75004 Paris', 'Cloud / Infrastructure', 'jobs@cloudforge.io', 'cloudforge_logo.png'),
(9, 'Humanis', 'Société de services RH accompagnant les entreprises dans la gestion du personnel, le recrutement et la formation. Elle favorise une approche humaine et personnalisée.', 'https://humanis-rh.fr', '10 rue de Zurich, 67000 Strasbourg', 'Ressources Humaines', 'contact@humanis-rh.fr', 'humanis_logo.png'),
(10, 'SalesPro', 'Entreprise spécialisée dans le développement commercial B2B. Elle propose des services de prospection, de formation à la vente et d’accompagnement à la stratégie commerciale.', 'https://salespro.fr', '33 rue de Brest, 35000 Rennes', 'Commerce / B2B', 'info@salespro.fr', 'salespro_logo.png');

-- --------------------------------------------------------

--
-- Structure de la table `Job_Ad`
--

CREATE TABLE `Job_Ad` (
  `id_ad` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `contract_type` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `date_posted` datetime DEFAULT CURRENT_TIMESTAMP,
  `remote` tinyint(1) DEFAULT '0',
  `experience_level` enum('junior','mid','senior') DEFAULT NULL,
  `id_company` int DEFAULT NULL,
  `id_contact_user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Job_Ad`
--

INSERT INTO `Job_Ad` (`id_ad`, `title`, `description`, `contract_type`, `location`, `salary`, `date_posted`, `remote`, `experience_level`, `id_company`, `id_contact_user`) VALUES
(1, 'Web Designer', 'En tant que Web Designer basé(e) à Paris, vous prenez en charge la conception visuelle et l\'expérience utilisateur des sites web et applications internes et externes. Vous collaborez étroitement avec les équipes produit, développement et marketing pour transformer des briefs fonctionnels en interfaces claires, accessibles et esthétiques. Responsabilités : concevoir des maquettes haute-fidélité et des prototypes interactifs, produire des assets optimisés pour le développement, garantir la cohérence graphique et l\'accessibilité, réaliser des tests utilisateurs et itérer en fonction des retours, documenter les guidelines de design. Compétences requises : maîtrise avancée d\'Adobe Photoshop et Illustrator, excellent niveau sur Figma (ou équivalent) pour prototypage, solide connaissance du HTML/CSS et des principes de responsive design, compréhension des contraintes front-end et capacité à collaborer avec des développeurs. Profil : 3+ ans d\'expérience en design d\'interface, portfolio démontrant des projets web complets, sens du détail et démarche centrée utilisateur. Atouts : expérience avec animation micro-interactions, connaissances de base en JS/React, expérience en design mobile-first. Conditions : CDI, poste basé à Paris, salaire indicatif 48000.00 EUR/an, présentiel majoritaire (possibilité de modalité hybride selon accord), avantages sociaux et budget formation.', 'CDI', 'Paris, France ', 48000.00, '2025-10-07 11:40:48', 0, 'mid', 2, 1),
(2, 'Développeur Frontend React', 'Créez et maintenez des interfaces utilisateurs modernes avec React et Redux. Travaillez en collaboration avec les équipes design et backend pour assurer une expérience utilisateur optimale. Stack : React, Redux, Tailwind CSS, Jest pour tests unitaires.', 'CDI', 'Paris, France', 48000.00, '2025-10-07 01:06:38', 1, 'mid', 1, 1),
(3, 'Technicien support informatique', 'Vous assurerez le support technique de niveau 1 et 2 auprès des utilisateurs internes. Diagnostic, résolution de pannes matérielles et logicielles, suivi des tickets et documentation des procédures seront vos principales missions.', 'CDD', 'Nantes', 28000.00, '2025-10-07 15:41:02', 0, 'junior', 3, 3),
(4, 'Responsable marketing', 'Chargé de la stratégie marketing globale, vous développerez la notoriété de la marque via des campagnes multicanales. Vous superviserez une petite équipe et analyserez les performances pour ajuster les plans d’action.', 'CDI', 'Bordeaux', 52000.00, '2025-10-07 15:41:02', 1, 'senior', 4, 4),
(5, 'Data Analyst', 'Vous exploiterez et analyserez de grands volumes de données pour aider à la prise de décision. Vous participerez à la création de tableaux de bord et de rapports à l’aide d’outils comme Power BI ou Tableau. Esprit analytique et rigueur sont essentiels.', 'CDI', 'Lille', 42000.00, '2025-10-07 15:41:02', 1, 'mid', 5, 5),
(6, 'Designer UX/UI', 'Vous participerez à la conception d’interfaces utilisateurs intuitives et esthétiques pour nos applications web et mobiles. Vous travaillerez en étroite collaboration avec les développeurs et les chefs de produit pour garantir une expérience fluide.', 'Stage', 'Marseille', 1200.00, '2025-10-07 15:41:02', 1, 'junior', 6, 6),
(7, 'Comptable', 'Au sein du service financier, vous gérerez la comptabilité clients et fournisseurs, assurerez le suivi des facturations et contribuerez aux clôtures mensuelles. Une bonne connaissance d’un ERP est souhaitée.', 'CDI', 'Toulouse', 35000.00, '2025-10-07 15:41:02', 0, 'mid', 7, 7),
(8, 'Ingénieur DevOps', 'Vous serez responsable de la mise en place et de la maintenance des pipelines CI/CD, de l’automatisation des déploiements et de la supervision des environnements cloud (AWS, Azure ou GCP). Une forte culture de la fiabilité et de la sécurité est attendue.', 'CDI', 'Paris', 60000.00, '2025-10-07 15:41:02', 1, 'senior', 1, 1),
(9, 'Assistant RH', 'Rattaché à la direction des ressources humaines, vous participerez à la gestion administrative du personnel, au suivi des recrutements et à l’organisation des formations internes. Sens de la confidentialité et rigueur administrative indispensables.', 'CDD', 'Strasbourg', 30000.00, '2025-10-07 15:41:02', 0, 'junior', 8, 8),
(10, 'Commercial B2B', 'Votre mission principale sera de développer le portefeuille client de l’entreprise auprès des professionnels. Vous identifierez les besoins, préparerez les propositions commerciales et assurerez le suivi des contrats signés.', 'CDI', 'Rennes', 38000.00, '2025-10-07 15:41:02', 1, 'mid', 9, 9);

-- --------------------------------------------------------

--
-- Structure de la table `Job_Technology`
--

CREATE TABLE `Job_Technology` (
  `id` int NOT NULL,
  `id_job` int DEFAULT NULL,
  `technology` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Job_Technology`
--

INSERT INTO `Job_Technology` (`id`, `id_job`, `technology`) VALUES
(7, 2, 'Python'),
(8, 2, 'React'),
(9, 2, 'SQL');

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id_user` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` enum('admin','recruiter','applicant') NOT NULL DEFAULT 'applicant',
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Users`
--

INSERT INTO `Users` (`id_user`, `first_name`, `last_name`, `email`, `phone`, `password`, `role`, `date_created`) VALUES
(1, 'Johanna', 'Angloma', 'johanna.angloma@epitech.eu', '0634051092', 'motdepasse', 'recruiter', '2025-10-07 01:04:39'),
(2, 'Jean', 'Dupont', 'jean.dupont@technova.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(3, 'Marie', 'Lambert', 'marie.lambert@digitalwave.com', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(4, 'Paul', 'Martin', 'paul.martin@infotek-services.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(5, 'Sophie', 'Bernard', 'sophie.bernard@marketedge.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(6, 'Luc', 'Moreau', 'luc.moreau@datascope.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(7, 'Julie', 'Robert', 'julie.robert@creativelab.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(8, 'Hugo', 'Lefevre', 'hugo.lefevre@finexa.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(9, 'Claire', 'Dubois', 'claire.dubois@humania-rh.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52'),
(10, 'Antoine', 'Girard', 'antoine.girard@bizconnect.fr', NULL, NULL, 'recruiter', '2025-10-07 15:37:52');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Application`
--
ALTER TABLE `Application`
  ADD PRIMARY KEY (`id_application`),
  ADD KEY `id_ad` (`id_ad`),
  ADD KEY `id_applicant` (`id_applicant`);

--
-- Index pour la table `Company`
--
ALTER TABLE `Company`
  ADD PRIMARY KEY (`id_company`);

--
-- Index pour la table `Job_Ad`
--
ALTER TABLE `Job_Ad`
  ADD PRIMARY KEY (`id_ad`),
  ADD KEY `id_company` (`id_company`),
  ADD KEY `id_contact_user` (`id_contact_user`);

--
-- Index pour la table `Job_Technology`
--
ALTER TABLE `Job_Technology`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_job` (`id_job`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Application`
--
ALTER TABLE `Application`
  MODIFY `id_application` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Company`
--
ALTER TABLE `Company`
  MODIFY `id_company` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `Job_Ad`
--
ALTER TABLE `Job_Ad`
  MODIFY `id_ad` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT pour la table `Job_Technology`
--
ALTER TABLE `Job_Technology`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Application`
--
ALTER TABLE `Application`
  ADD CONSTRAINT `Application_ibfk_1` FOREIGN KEY (`id_ad`) REFERENCES `Job_Ad` (`id_ad`) ON DELETE CASCADE,
  ADD CONSTRAINT `Application_ibfk_2` FOREIGN KEY (`id_applicant`) REFERENCES `Users` (`id_user`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Job_Ad`
--
ALTER TABLE `Job_Ad`
  ADD CONSTRAINT `Job_Ad_ibfk_1` FOREIGN KEY (`id_company`) REFERENCES `Company` (`id_company`) ON DELETE SET NULL,
  ADD CONSTRAINT `Job_Ad_ibfk_2` FOREIGN KEY (`id_contact_user`) REFERENCES `Users` (`id_user`) ON DELETE SET NULL;

--
-- Contraintes pour la table `Job_Technology`
--
ALTER TABLE `Job_Technology`
  ADD CONSTRAINT `Job_Technology_ibfk_1` FOREIGN KEY (`id_job`) REFERENCES `Job_Ad` (`id_ad`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
