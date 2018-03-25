<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $page = basename($_SERVER['PHP_SELF']);

    $experienceActiveClass = ($page == "experience.php") ? "active-navigation-node" : "inactive-navigation-node";
    $projectsActiveClass = ($page == "projects.php") ? "active-navigation-node" : "inactive-navigation-node";
    $cvActiveClass = ($page == "cv.php") ? "active-navigation-node" : "inactive-navigation-node";
    $contactActiveClass = ($page == "contact.php") ? "active-navigation-node" : "inactive-navigation-node";
?>
<div id="navigation">
    <div id="navigation-left">
        <div id="navigation-about" class="navigation-node">
            <a class="navigation-link" href="index.php">Kyle Bignell</a>
        </div>
    </div>

    <div id="navigation-right">
        <div id="navigation-projects" class="navigation-node <?php echo $experienceActiveClass ?>">
            <a class="navigation-link" href="experience.php">Experience</a>
        </div>
        <div id="navigation-projects" class="navigation-node <?php echo $projectsActiveClass ?>">
            <a class="navigation-link" href="projects.php">Projects</a>
        </div>
        <div id="navigation-cv" class="navigation-node <?php echo $cvActiveClass ?>">
            <a class="navigation-link" href="cv.php">CV</a>
        </div>
        <div id="navigation-contact" class="navigation-node <?php echo $contactActiveClass ?>">
            <a class="navigation-link" href="contact.php">Contact</a>
        </div>
    </div>
</div>
