<?php
    $page = basename($_SERVER['PHP_SELF']);

    $experienceActiveClass = ($page == "experience.php") ? "active-navigation-node" : "inactive-navigation-node";
    $projectsActiveClass = ($page == "projects.php") ? "active-navigation-node" : "inactive-navigation-node";
    $blogActiveClass = ($page == "blog.php") ? "active-navigation-node" : "inactive-navigation-node";
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
        <a class="navigation-link" href="<?= $relativePath ?>experience.php"><div id="navigation-projects" class="navigation-node <?php echo $experienceActiveClass ?>">EXPERIENCE</div></a>
        <a class="navigation-link" href="<?= $relativePath ?>projects.php"><div id="navigation-projects" class="navigation-node <?php echo $projectsActiveClass ?>">PROJECTS</div></a>
        <a class="navigation-link" href="<?= $relativePath ?>blog.php"><div id="navigation-projects" class="navigation-node <?php echo $blogActiveClass ?>">BLOG</div></a>
        <a class="navigation-link" href="<?= $relativePath ?>cv.php"><div id="navigation-cv" class="navigation-node <?php echo $cvActiveClass ?>">CV</div></a>
    </div>
</div>
