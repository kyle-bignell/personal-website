<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $page = basename($_SERVER['PHP_SELF']);

    $indexActiveClass = ($page == "index.php") ? "active-navigation-node" : "inactive-navigation-node";
    $professionalExperienceActiveClass = ($page == "professional_experience.php") ? "active-navigation-node" : "inactive-navigation-node";
    $sideProjectsActiveClass = ($page == "side_projects.php") ? "active-navigation-node" : "inactive-navigation-node";
    $cvActiveClass = ($page == "cv.php") ? "active-navigation-node" : "inactive-navigation-node";
    $contactActiveClass = ($page == "contact.php") ? "active-navigation-node" : "inactive-navigation-node";

    echo '
        <div id="navigation">
            <div id="navigation-about" class="navigation-node ' . $indexActiveClass . '">
                <a class="navigation-link" href="index.php">Home</a>
            </div>
            <div id="navigation-projects" class="navigation-node ' . $professionalExperienceActiveClass . '">
                <a class="navigation-link" href="professional_experience.php">Professional Experience</a>
            </div>
            <div id="navigation-projects" class="navigation-node ' . $sideProjectsActiveClass . '">
                <a class="navigation-link" href="side_projects.php">Side Projects</a>
            </div>
            <div id="navigation-cv" class="navigation-node ' . $cvActiveClass . '">
                <a class="navigation-link" href="cv.php">CV</a>
            </div>
            <div id="navigation-contact" class="navigation-node ' . $contactActiveClass . '">
                <a class="navigation-link" href="contact.php">Contact</a>
            </div>
        </div>';
?>
