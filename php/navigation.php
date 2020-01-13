<?php
    $page = basename($_SERVER['PHP_SELF']);

    $experienceActiveClass = ($page == "experience.php") ? "active" : "";
    $projectsActiveClass = ($page == "projects.php") ? "active" : "";
    $blogActiveClass = ($page == "blog.php") ? "active" : "";
    $cvActiveClass = ($page == "cv.php") ? "active" : "";

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

<header>
  <div class="navbar-fixed">
    <nav class="orange lighten-2">
      <div class="container nav-wrapper">
        <a href="<?= $relativePath ?>index.php" class="black-text brand-logo">KYLE BIGNELL</a>
        <a href="#" data-target="mobile-nav" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
          <li class="<?=$projectsActiveClass?>"><a class="black-text" href="<?=$relativePath?>projects.php">PROJECTS</a></li>
          <li class="<?=$blogActiveClass?>"><a class="black-text" href="<?=$relativePath?>blog.php">BLOG</a></li>
          <li class="<?=$experienceActiveClass?>"><a class="black-text" href="<?=$relativePath?>experience.php">EXPERIENCE</a></li>
        </ul>
      </div>
    </nav>
  </div>

  <ul class="sidenav" id="mobile-nav">
    <li class=""><a href="<?=$relativePath?>index.php">KYLE BIGNELL</a></li>
    <li class="<?=$projectsActiveClass?>"><a href="<?=$relativePath?>projects.php">PROJECTS</a></li>
    <li class="<?=$blogActiveClass?>"><a href="<?=$relativePath?>blog.php">BLOG</a></li>
    <li class="<?=$experienceActiveClass?>"><a href="<?=$relativePath?>experience.php">EXPERIENCE</a></li>
  </ul>
</header>
