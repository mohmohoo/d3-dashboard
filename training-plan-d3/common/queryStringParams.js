var parameters = (function (searchParams) {
    function get(name, defaultValue)
    {
        return searchParams.get("page");
    }

    return 
    {
        get 
    };
} ((new URL((document).location)).searchParams));