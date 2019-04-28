window.addEventListener("load", function()
{
    document.getElementById("navigation-right-menu-icon").addEventListener("click", function()
    {
        var navRight = document.getElementById("navigation-right");
        var navRightDisplay = getComputedStyle(navRight).display

        if (navRightDisplay != "none")
        {
            navRight.style.display = "none";
        }
        else
        {
            navRight.style.display = "block";
        }
    });
});
