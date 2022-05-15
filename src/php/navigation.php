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
        <a href="<?= $relativePath ?>index.php" class="black-text brand-logo truncate">KYLE BIGNELL</a>
        <a href="#" data-target="mobile-nav" class="sidenav-trigger black-text"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
          <li class="<?=$projectsActiveClass?>"><a class="black-text" href="<?=$relativePath?>projects.php">PROJECTS</a></li>
          <li class="<?=$blogActiveClass?>"><a class="black-text" href="<?=$relativePath?>blog.php">BLOG</a></li>
          <li class="<?=$experienceActiveClass?>"><a class="black-text" href="<?=$relativePath?>experience.php">EXPERIENCE</a></li>
        </ul>
      </div>
    </nav>
  </div>

  <ul class="sidenav" id="mobile-nav">
    <li class="orange lighten-2">
      <a href="<?=$relativePath?>index.php" style="height: auto; padding-bottom: 5px">
        <div class="user-view">
          <img class="circle" src="assets/images/kyle-bignell.png">
          <h5>KYLE BIGNELL</h5>
        </div>
      </a>
    </li>
    <li>
      <a href="<?=$relativePath?>projects.php"><i class="material-icons">computer</i>PROJECTS</a>
    </li>
    <li>
      <a href="<?=$relativePath?>blog.php"><i class="material-icons">chrome_reader_mode</i>BLOG</a>
    </li>
    <li>
      <a href="<?=$relativePath?>experience.php"><i class="material-icons">person_add</i>EXPERIENCE</a>
    </li>
    <li>
      <div class="divider"></div>
    </li>
    <li>
      <a target="_blank" href="https://www.linkedin.com/in/kyle-bignell-52592785/">LinkedIn</a>
    </li>
    <li>
      <a target="_blank" href="https://bitbucket.org/kyle_bignell/">Bitbucket</a>
    </li>
  </ul>
</header>
