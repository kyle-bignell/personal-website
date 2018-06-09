<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $page = basename($_SERVER['PHP_SELF']);

    $experienceActiveClass = ($page == "experience.php") ? "active-navigation-node" : "inactive-navigation-node";
    $projectsActiveClass = ($page == "projects.php") ? "active-navigation-node" : "inactive-navigation-node";
    $cvActiveClass = ($page == "cv.php") ? "active-navigation-node" : "inactive-navigation-node";
?>
<div id="navigation">
    <div id="navigation-left">
        <div id="navigation-about" class="navigation-node-home">
            <a class="navigation-link" href="index.php">KYLE BIGNELL</a>
        </div>
    </div>

    <div id="navigation-right-menu">
        <img id="navigation-right-menu-icon" src="assets/icons/menu-button.png"/>
    </div>

    <div id="navigation-right">
        <a class="navigation-link" href="experience.php"><div id="navigation-projects" class="navigation-node <?php echo $experienceActiveClass ?>">EXPERIENCE</div></a>
        <a class="navigation-link" href="projects.php"><div id="navigation-projects" class="navigation-node <?php echo $projectsActiveClass ?>">PROJECTS</div></a>
        <a class="navigation-link" href="cv.php"><div id="navigation-cv" class="navigation-node <?php echo $cvActiveClass ?>">CV</div></a>
    </div>
</div>
