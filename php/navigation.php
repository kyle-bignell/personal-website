<?php
    $page = basename($_SERVER['PHP_SELF']);

    $experienceActiveClass = ($page == "experience.php") ? "active-navigation-node" : "inactive-navigation-node";
    $projectsActiveClass = ($page == "projects.php") ? "active-navigation-node" : "inactive-navigation-node";
    $cvActiveClass = ($page == "cv.php") ? "active-navigation-node" : "inactive-navigation-node";

    $relativePath = "";
    if (strpos($_SERVER["PHP_SELF"], "/php/") !== false)
    {
        $relativePath = "../";
    }
    else if (strpos($_SERVER["PHP_SELF"], "/projects/") !== false)
    {
        $relativePath = "../";
    }
?>
<div id="navigation">
    <div id="navigation-left">
        <div id="navigation-about" class="navigation-node-home">
            <a class="navigation-link" href="<?= $relativePath ?>index.php">KYLE BIGNELL</a>
        </div>
    </div>

    <div id="navigation-right-menu">
        <img id="navigation-right-menu-icon" src="<?= $relativePath ?>assets/icons/menu-button.png"/>
    </div>

    <div id="navigation-right">
        <div id="navigation-projects" class="navigation-node <?php echo $experienceActiveClass ?>"><a class="navigation-link" href="<?= $relativePath ?>experience.php">EXPERIENCE</a></div>
        <div id="navigation-projects" class="navigation-node <?php echo $projectsActiveClass ?>"><a class="navigation-link" href="<?= $relativePath ?>projects.php">PROJECTS</a></div>
        <div id="navigation-cv" class="navigation-node <?php echo $cvActiveClass ?>"><a class="navigation-link" href="<?= $relativePath ?>cv.php">CV</a></div>
    </div>
</div>
