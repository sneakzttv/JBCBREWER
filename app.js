/* ============================================================
   GITHUB PAGES / STATIC APP
============================================================ */

"use strict";


/* ============================================================
   CONFIGURATION
============================================================ */

const DEFAULT_BASE_PPM = 50.0;

const HIGH_FOAM_SUPPORT_STYLES = new Set([
    "hazy pale ale",
    "hazy ipa",
    "stout",
    "wheat beer",
    "wheat lager",
    "mid strength wheat lager"
]);


const LIGHT_OR_ADJUNCT_STYLES = new Set([
    "light beer",
    "light lager",
    "low carb lager",
    "low carb dry lager"
]);


const ingredientDatabase = {

    "LME": {
        name: "LME",
        default_unit: "kg",
        adjustment_per_kg: -0.50,
        description:
            "Malt-derived proteins and foam-active material."
    },

    "Wheat Malt Extract": {
        name: "Wheat Malt Extract",
        default_unit: "l",
        adjustment_per_litre: -0.65,
        description:
            "Liquid wheat malt extract counted by litre."
    },

    "Yeast": {
        name: "Yeast",
        default_unit: "kg",
        adjustment_per_kg: -0.50,
        description:
            "Yeast solids can provide a small foam-support contribution."
    },

    "Dextrose": {
        name: "Dextrose",
        default_unit: "kg",
        adjustment_per_kg: 1.00,
        description:
            "Fermentable sugar with little direct foam-positive protein."
    },

    "Glucose": {
        name: "Glucose",
        default_unit: "kg",
        adjustment_per_kg: 1.00,
        description:
            "Fermentable sugar with little direct foam-positive protein."
    },
        "Hops": {
            name: "Hops",
            default_unit: "g",
            adjustment_per_kg: 0.00,
            description:
                "Recipe hop additions displayed without a foam adjustment."
        },

    "Maltodextrin": {
        name: "Maltodextrin",
        default_unit: "kg",
        adjustment_per_kg: -1.00,
        description:
            "Adds body/dextrins which can support foam retention."
    },

    "Malto dextrine": {
        name: "Malto dextrine",
        default_unit: "kg",
        adjustment_per_kg: -1.00,
        description:
            "Adds body/dextrins which can support foam retention."
    },

    "Rolled Oats": {
        name: "Rolled Oats",
        default_unit: "kg",
        adjustment_per_kg: -0.50,
        description:
            "Protein/beta-glucan contribution, partially offset by oat lipids."
    },

    "Oats": {
        name: "Oats",
        default_unit: "kg",
        adjustment_per_kg: -0.50,
        description:
            "Oat-derived protein and beta-glucans."
    },

    "Pilsner Malt": {
        name: "Pilsner Malt",
        default_unit: "kg",
        adjustment_per_kg: -0.50,
        description:
            "Malt-derived foam-active proteins."
    },

    "Pilsner": {
        name: "Pilsner",
        default_unit: "kg",
        adjustment_per_kg: -0.50,
        description:
            "Malt-derived foam-active proteins."
    },

    "Wheat Malt": {
        name: "Wheat Malt",
        default_unit: "kg",
        adjustment_per_kg: -0.75,
        description:
            "Wheat proteins can provide strong foam support."
    },

    "Wheat": {
        name: "Wheat",
        default_unit: "kg",
        adjustment_per_kg: -0.75,
        description:
            "Wheat-derived foam-active proteins."
    },

    "Crystal Malt": {
        name: "Crystal Malt",
        default_unit: "kg",
        adjustment_per_kg: -0.30,
        description:
            "Malt-derived foam-active material."
    },

    "Crystal": {
        name: "Crystal",
        default_unit: "kg",
        adjustment_per_kg: -0.30,
        description:
            "Malt-derived foam-active material."
    },

    "Chocolate Malt": {
        name: "Chocolate Malt",
        default_unit: "kg",
        adjustment_per_kg: -0.25,
        description:
            "Dark malt with some protein contribution."
    },

    "Chocolate": {
        name: "Chocolate",
        default_unit: "kg",
        adjustment_per_kg: -0.25,
        description:
            "Dark malt with some protein contribution."
    },

    "Roast Barley": {
        name: "Roast Barley",
        default_unit: "kg",
        adjustment_per_kg: -0.15,
        description:
            "Roasted grain with a small assumed foam contribution."
    },

    "Munich Malt": {
        name: "Munich Malt",
        default_unit: "kg",
        adjustment_per_kg: -0.30,
        description:
            "Malt-derived proteins and body."
    },

    "Munich": {
        name: "Munich",
        default_unit: "kg",
        adjustment_per_kg: -0.30,
        description:
            "Malt-derived proteins and body."
    },

    "Corn": {
        name: "Corn",
        default_unit: "kg",
        adjustment_per_kg: 0.25,
        description:
            "Adjunct grain with lower foam-positive protein contribution."
    },

    "Carared": {
        name: "Carared",
        default_unit: "kg",
        adjustment_per_kg: -0.20,
        description:
            "Specialty malt with modest foam support."
    }

};


/* ============================================================
   ALIASES
============================================================ */

const ingredientAliases = {

    "glucose": "Glucose",
    "dextrose": "Dextrose",
    "hops": "Hops",
    "maltodextrin": "Maltodextrin",
    "malto dextrine": "Malto dextrine",
    "rolled oats": "Rolled Oats",
    "oats": "Oats",
    "pilsner malt": "Pilsner Malt",
    "pilsner": "Pilsner",
    "wheat malt": "Wheat Malt",
    "wheat malt extract": "Wheat Malt Extract",
    "wheat": "Wheat",
    "yeast": "Yeast",
    "crystal malt": "Crystal Malt",
    "crystal": "Crystal",
    "chocolate malt": "Chocolate Malt",
    "chocolate": "Chocolate",
    "roast barley": "Roast Barley",
    "munich malt": "Munich Malt",
    "munich": "Munich",
    "corn": "Corn",
    "carared": "Carared"

};


/* ============================================================
   DATABASE
============================================================ */

let recipeDatabase = {};

let recipes = [];


/* ============================================================
   INITIALISE
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        /*
         * Simple client-side login gate.
         *
         * IMPORTANT:
         * This is not real security.
         */

        if (
            localStorage.getItem(
                "fraLoggedIn"
            ) !== "true"
        ) {

            window.location.href =
                "login.html";

            return;

        }


        try {

            await loadRecipes();

            initialiseCalculator();

        } catch (error) {

            console.error(
                "Unable to load recipes:",
                error
            );

            showError(
                "Unable to load recipes.json. Please check that the file exists."
            );

        }

    }
);


/* ============================================================
   LOAD RECIPES
============================================================ */

async function loadRecipes() {

    const response =
        await fetch(
            "recipes.json",
            {
                cache: "no-cache"
            }
        );


    if (!response.ok) {

        throw new Error(
            "recipes.json returned HTTP " +
            response.status
        );

    }


    recipes =
        await response.json();


    recipes.sort(
        function(a, b) {

            return String(
                a.name || ""
            ).localeCompare(
                String(b.name || ""),
                undefined,
                {
                    sensitivity: "base"
                }
            );

        }
    );


    recipeDatabase = {};


    recipes.forEach(
        function(recipe) {

            recipeDatabase[
                recipe.name
            ] = recipe;

        }
    );


    populateRecipeSelector();

}


/* ============================================================
   RECIPE SELECTOR
============================================================ */

function populateRecipeSelector() {

    const selector =
        document.getElementById(
            "recipe-selector"
        );


    if (!selector) {
        return;
    }


    recipes.forEach(
        function(recipe) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                recipe.name;


            option.textContent =
                recipe.name;


            selector.appendChild(
                option
            );

        }
    );


    selector.addEventListener(
        "change",
        function() {

            showRecipe(
                this.value,
                true
            );

        }
    );

}


/* ============================================================
   RECIPE BASE PPM
============================================================ */

function basePPMForRecipe(recipe) {

    const style =
        String(
            recipe.style || ""
        )
        .trim()
        .toLowerCase();


    if (
        HIGH_FOAM_SUPPORT_STYLES.has(
            style
        )
    ) {

        return 30.0;

    }


    if (
        LIGHT_OR_ADJUNCT_STYLES.has(
            style
        )
    ) {

        return 100.0;

    }


    return DEFAULT_BASE_PPM;

}


function updateRecipeFRAAmount(
    recipe
) {

    const element =
        document.getElementById(
            "recipe-base-fra"
        );


    const batchSize =
        Number(
            document.getElementById(
                "batch_size"
            ).value
        );


    if (
        !element ||
        !Number.isFinite(batchSize) ||
        batchSize <= 0
    ) {

        return;

    }


    const basePPM =
        basePPMForRecipe(
            recipe
        );


    const fraGrams =
        batchSize *
        basePPM /
        1000.0;


    const waterMl =
        fraGrams /
        0.02 -
        fraGrams;


    element.textContent =
        fraGrams.toFixed(2) +
        " g / " +
        waterMl.toFixed(0) +
        " ml water\n" +
        basePPM.toFixed(1) +
        " ppm";

}


/* ============================================================
   SHOW RECIPE
============================================================ */

function showRecipe(
    recipeName,
    loadIngredients = true
) {

    const display =
        document.getElementById(
            "recipe-display"
        );


    const customSettings =
        document.getElementById(
            "custom-settings"
        );


    const description =
        document.getElementById(
            "ingredient-section-description"
        );


    if (
        !display ||
        !customSettings
    ) {

        return;

    }


    if (
        recipeName === "__custom__"
    ) {

        display.classList.add(
            "hidden"
        );


        customSettings.classList.remove(
            "hidden"
        );


        if (description) {

            description.textContent =
                "Enter the ingredients that affect the custom recipe's foam-retention requirement.";

        }


        return;

    }


    customSettings.classList.add(
        "hidden"
    );


    const recipe =
        recipeDatabase[
            recipeName
        ];


    if (!recipe) {

        display.classList.add(
            "hidden"
        );

        return;

    }


    /* =================================================
       BASIC RECIPE INFORMATION
    ================================================== */

    document.getElementById(
        "recipe-title"
    ).textContent =
        recipe.name || recipeName;


    document.getElementById(
        "recipe-style"
    ).textContent =
        recipe.style || "Beer Recipe";


    document.getElementById(
        "recipe-og"
    ).textContent =
        recipe.original_gravity || "N/A";


    document.getElementById(
        "recipe-fg"
    ).textContent =
        recipe.final_gravity || "N/A";


    document.getElementById(
        "recipe-abv"
    ).textContent =
        recipe.alcohol || "N/A";


    updateRecipeFRAAmount(
        recipe
    );


    /* =================================================
       DEXTROSE
    ================================================== */

    document.getElementById(
        "recipe-dextrose"
    ).textContent =
        recipe.dextrose || "N/A";


    /* =================================================
       MALTODEXTRIN
    ================================================== */

    document.getElementById(
        "recipe-maltodextrin"
    ).textContent =
        recipe.maltodextrin || "N/A";


    /* =================================================
       RECIPE DETAILS
    ================================================== */

    document.getElementById(
        "recipe-fermentables"
    ).textContent =
        recipe.fermentables || "N/A";


    document.getElementById(
        "recipe-grains"
    ).textContent =
        recipe.grains || "N/A";


    document.getElementById(
        "recipe-hops"
    ).textContent =
        recipe.hops || "N/A";


    document.getElementById(
        "recipe-yeast"
    ).textContent =
        recipe.yeast || "N/A";


    document.getElementById(
        "recipe-extras"
    ).textContent =
        recipe.extras || "N/A";


    document.getElementById(
        "recipe-notes"
    ).textContent =
        recipe.extra ||
        recipe.notes ||
        "N/A";


    display.classList.remove(
        "hidden"
    );


    if (description) {

        description.textContent =
            "Recognized fermentables and grains were loaded automatically. You can adjust them before calculating.";
                "Recognized fermentables, grains, dextrose, and hops were loaded automatically. You can adjust them before calculating.";

    }


    if (loadIngredients) {

        loadRecipeIngredients(
            recipe
        );

    }

}


function parseHopText(
    text
) {

    const totalGrams =
        Array.from(
            String(text || "").matchAll(
                /(\d+(?:\.\d+)?)\s*g\s+[^,]+/gi
            )
        ).reduce(
            function(total, match) {

                return total + Number(match[1]);

            },
            0
        );


    if (totalGrams === 0) {
        return [];
    }


    return [{
        name: "Hops",
        amount: totalGrams,
        unit: "g"
    }];

}

/* ============================================================
   PARSE INGREDIENTS
============================================================ */

function matchIngredientName(
    rawName
) {

    const normalized =
        String(rawName)
            .trim()
            .toLowerCase();


    const aliases =
        Object.keys(
            ingredientAliases
        ).sort(
            function(a, b) {

                return b.length - a.length;

            }
        );


    for (
        const alias of aliases
    ) {

        if (
            normalized.includes(
                alias
            )
        ) {

            return ingredientAliases[
                alias
            ];

        }

    }


    return null;

}


function parseIngredientText(
    text
) {

    const parsed = [];


    String(text || "")
        .split(",")
        .forEach(
            function(item) {

                const match =
                    item
                        .trim()
                        .match(
                            /^(\d+(?:\.\d+)?)\s*(kg|g|l)\s+(.+)$/i
                        );


                if (!match) {
                    return;
                }


                const amount =
                    Number(
                        match[1]
                    );


                const unit =
                    match[2].toLowerCase();


                const name =
                    matchIngredientName(
                        match[3]
                    );


                if (!name) {
                    return;
                }


                parsed.push({
                    name: name,
                    amount: amount,
                    unit: unit
                });

            }
        );


    return parsed;

}


function loadRecipeIngredients(
    recipe
) {

    const list =
        document.getElementById(
            "ingredient-list"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    const ingredients = [

        ...parseIngredientText(
            recipe.fermentables
        ),

        ...parseIngredientText(
            recipe.grains
        ),

        ...parseIngredientText(
            recipe.yeast
        ),

        ...parseIngredientText(
            String(recipe.dextrose || "") + " Dextrose"
        ),

        ...parseIngredientText(
            String(recipe.maltodextrin || "") + " Maltodextrin"
        ),

        ...parseHopText(
            recipe.hops
        )

    ];


    ingredients.forEach(
        function(ingredient) {

            addIngredient(
                {
                    ...ingredient,
                    recipeIngredient: true
                }
            );

        }
    );

}


/* ============================================================
   INGREDIENT ROWS
============================================================ */

function buildIngredientOptions(
    selectedName = ""
) {

    const fragment =
        document.createDocumentFragment();


    const emptyOption =
        document.createElement(
            "option"
        );


    emptyOption.value = "";

    emptyOption.textContent =
        "Select ingredient";


    fragment.appendChild(
        emptyOption
    );


    Object.keys(
        ingredientDatabase
    ).forEach(
        function(name) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                name;


            option.textContent =
                name;


            if (
                name === selectedName
            ) {

                option.selected =
                    true;

            }


            fragment.appendChild(
                option
            );

        }
    );


    return fragment;

}


function buildIngredientRow(
    ingredient = {}
) {

    const name =
        ingredient.name || "";


    const parsedAmount =
        Number(
            ingredient.amount
        );


    const amount =
        Number.isFinite(
            parsedAmount
        )
            ? parsedAmount
            : 0;


    const unit =
        ["kg", "g", "l"].includes(
            String(
                ingredient.unit || "kg"
            ).toLowerCase()
        )
            ? String(
                ingredient.unit || "kg"
            ).toLowerCase()
            : "kg";


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "ingredient-row";


    if (
        ingredient.recipeIngredient
    ) {

        row.dataset.recipeIngredient =
            "true";

        row.dataset.originalName =
            name;

        row.dataset.originalAmount =
            amount;

        row.dataset.originalUnit =
            unit;

    }


    /* Ingredient */

    const ingredientCell =
        document.createElement(
            "div"
        );


    const select =
        document.createElement(
            "select"
        );


    select.name =
        "ingredient_name";


    select.className =
        "ingredient-name";


    select.appendChild(
        buildIngredientOptions(
            name
        )
    );


    ingredientCell.appendChild(
        select
    );


    /* Amount */

    const amountCell =
        document.createElement(
            "div"
        );


    const amountInput =
        document.createElement(
            "input"
        );


    amountInput.type =
        "number";


    amountInput.name =
        "ingredient_amount";


    amountInput.className =
        "ingredient-amount";


    amountInput.min =
        "0";


    amountInput.step =
        "0.1";


    amountInput.value =
        amount;


    amountCell.appendChild(
        amountInput
    );


    /* Unit */

    const unitCell =
        document.createElement(
            "div"
        );


    const unitSelect =
        document.createElement(
            "select"
        );


    unitSelect.name =
        "ingredient_unit";


    unitSelect.className =
        "ingredient-unit";


    ["kg", "g", "l"].forEach(
        function(unitName) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                unitName;


            option.textContent =
                unitName === "l"
                    ? "L"
                    : unitName;


            option.selected =
                unit === unitName;


            unitSelect.appendChild(
                option
            );

        }
    );


    unitCell.appendChild(
        unitSelect
    );


    /* Factor */

    const factorCell =
        document.createElement(
            "div"
        );


    factorCell.className =
        "ingredient-factor";


    factorCell.textContent =
        getFactorText(
            name
        );


    /* Remove */

    const removeCell =
        document.createElement(
            "div"
        );


    const removeButton =
        document.createElement(
            "button"
        );


    removeButton.type =
        "button";


    removeButton.className =
        "remove-button";


    removeButton.textContent =
        "×";


    removeButton.setAttribute(
        "aria-label",
        "Remove ingredient"
    );


    removeButton.addEventListener(
        "click",
        function() {

            row.remove();

        }
    );


    removeCell.appendChild(
        removeButton
    );


    row.appendChild(
        ingredientCell
    );

    row.appendChild(
        amountCell
    );

    row.appendChild(
        unitCell
    );

    row.appendChild(
        factorCell
    );

    row.appendChild(
        removeCell
    );


    select.addEventListener(
        "change",
        function() {

            factorCell.textContent =
                getFactorText(
                    this.value
                );

        }
    );


    return row;

}


function getFactorText(
    name
) {

    const data =
        ingredientDatabase[
            name
        ];


    if (!data) {

        return "0.00 ppm/kg";

    }


    if (data.adjustment_per_litre !== undefined) {

        const litreFactor =
            Number(data.adjustment_per_litre);


        return (
            (litreFactor >= 0 ? "+" : "") +
            litreFactor.toFixed(2) +
            " ppm/L"
        );

    }


    const factor =
        Number(
            data.adjustment_per_kg
        );


    return (
        (factor >= 0 ? "+" : "") +
        factor.toFixed(2) +
        " ppm/kg"
    );

}


function addIngredient(
    ingredient = {}
) {

    const list =
        document.getElementById(
            "ingredient-list"
        );


    if (!list) {
        return;
    }


    list.appendChild(
        buildIngredientRow(
            ingredient
        )
    );

}


/* ============================================================
   CONVERSION
============================================================ */

function amountToKg(
    amount,
    unit
) {

    unit =
        String(
            unit || "kg"
        ).toLowerCase();


    if (
        unit === "kg"
    ) {

        return amount;

    }


    if (
        unit === "g"
    ) {

        return amount / 1000.0;

    }


    return null;

}


function adjustmentForIngredient(
    name,
    amount,
    unit
) {

    const data =
        ingredientDatabase[name];


    if (
        data &&
        String(unit || "").toLowerCase() === "l" &&
        data.adjustment_per_litre !== undefined
    ) {

        return Number(data.adjustment_per_litre) * amount;

    }


    const kgAmount =
        amountToKg(
            amount,
            unit
        );


    return kgAmount === null
        ? 0
        : kgAmount * Number(data ? data.adjustment_per_kg || 0 : 0);

}


/* ============================================================
   CALCULATE RECIPE ADJUSTMENT
============================================================ */

function calculateRecipeAdjustment(
    recipe
) {

    let totalAdjustment =
        0;


    const ingredientBreakdown =
        [];

    recipe.forEach(
        function(ingredient) {

            const name =
                String(
                    ingredient.name || ""
                ).trim();


            let amount =
                Number(
                    ingredient.amount
                );

            const unit =
                String(
                    ingredient.unit || "kg"
                ).toLowerCase();


            if (
                !Number.isFinite(
                    amount
                ) ||
                amount <= 0
            ) {

                if (
                    ingredient.originalName &&
                    amount === 0
                ) {

                    const originalData =
                        ingredientDatabase[
                            ingredient.originalName
                        ];

                    const originalKgAmount =
                        amountToKg(
                            Number(
                                ingredient.originalAmount
                            ),
                            ingredient.originalUnit
                        );

                    if (
                        originalKgAmount !== null ||
                        (
                            String(ingredient.originalUnit || "").toLowerCase() === "l" &&
                            originalData &&
                            originalData.adjustment_per_litre !== undefined
                        )
                    ) {

                        const adjustment =
                            -adjustmentForIngredient(
                                ingredient.originalName,
                                Number(ingredient.originalAmount),
                                ingredient.originalUnit
                            );

                        totalAdjustment +=
                            adjustment;

                        if (
                            Math.abs(adjustment) < 0.000001
                        ) {

                        }

                        ingredientBreakdown.push({

                            name: name,

                            amount: amount,

                            unit: unit,

                            kg_amount: null,

                            adjustment_per_kg:
                                Number(
                                    originalData
                                        ? originalData.adjustment_per_kg
                                        : 0
                                ),

                            adjustment: adjustment,

                            calculation_note:
                                "Original recipe ingredient removed"

                        });

                    } else if (
                        ingredient.originalName
                    ) {

                    }

                }

                return;

            }


            const data =
                ingredientDatabase[
                    name
                ];


            const adjustmentPerKg =
                data
                    ? Number(
                        data.adjustment_per_kg
                    )
                    : 0;


            const kgAmount =
                amountToKg(
                    amount,
                    unit
                );


            let adjustment =
                0;


            let calculationNote =
                "";


            if (
                kgAmount === null &&
                !(
                    unit === "l" &&
                    data &&
                    data.adjustment_per_litre !== undefined
                )
            ) {

                calculationNote =
                    "No kg conversion - coefficient not applied";

            } else {

                adjustment =
                    adjustmentForIngredient(
                        name,
                        amount,
                        unit
                    );

            }


            totalAdjustment +=
                adjustment;

            const wasEdited =
                ingredient.originalName &&
                (
                    name !== ingredient.originalName ||
                    amount !== Number(
                        ingredient.originalAmount
                    ) ||
                    unit !== String(
                        ingredient.originalUnit || ""
                    ).toLowerCase()
                );

            if (
                wasEdited &&
                Math.abs(adjustment) < 0.000001
            ) {

                calculationNote =
                    "Edited ingredient does not change PPM";

            }

            if (
                ingredient.originalName &&
                !wasEdited &&
                Math.abs(adjustment) < 0.000001
            ) {

                return;

            }


            ingredientBreakdown.push({

                name: name,

                amount: amount,

                unit: unit,

                kg_amount: kgAmount,

                adjustment_per_kg:
                    adjustmentPerKg,

                adjustment: adjustment,

                calculation_note:
                    calculationNote,

                originalName:
                    ingredient.originalName || ""

            });

        }
    );


    return {
        totalAdjustment,
        ingredientBreakdown
    };

}


/* ============================================================
   MAIN FRA CALCULATION
============================================================ */

function calculateFRA(
    event
) {

    event.preventDefault();


    hideError();


    try {

        const batchSize =
            Number(
                document.getElementById(
                    "batch_size"
                ).value
            );


        if (
            !Number.isFinite(
                batchSize
            ) ||
            batchSize <= 0
        ) {

            throw new Error(
                "Invalid batch size."
            );

        }


        const selectedRecipe =
            document.getElementById(
                "recipe-selector"
            ).value;


        if (!selectedRecipe) {

            throw new Error(
                "Please select a recipe."
            );

        }


        let basePPM;


        if (
            selectedRecipe ===
            "__custom__"
        ) {

            basePPM =
                Number(
                    document.getElementById(
                        "custom_ppm"
                    ).value
                );


            if (
                !Number.isFinite(
                    basePPM
                ) ||
                basePPM <= 0
            ) {

                throw new Error(
                    "Please enter a valid custom FRA PPM."
                );

            }

        } else {

            const savedRecipe =
                recipeDatabase[
                    selectedRecipe
                ];


            if (!savedRecipe) {

                throw new Error(
                    "Invalid recipe selected."
                );

            }


            basePPM =
                basePPMForRecipe(
                    savedRecipe
                );

        }


        const rows =
            document.querySelectorAll(
                "#ingredient-list .ingredient-row"
            );


        const recipe = [];


        rows.forEach(
            function(row) {

                const name =
                    row.querySelector(
                        ".ingredient-name"
                    ).value.trim();


                if (!name) {
                    return;
                }


                const amount =
                    Number(
                        row.querySelector(
                            ".ingredient-amount"
                        ).value
                    );


                const unit =
                    row.querySelector(
                        ".ingredient-unit"
                    ).value;


                if (
                    !Number.isFinite(
                        amount
                    ) ||
                    amount < 0
                ) {

                    return;

                }


                recipe.push({

                    name: name,

                    amount: amount,

                    unit: unit,

                    originalName:
                        row.dataset.originalName || "",

                    originalAmount:
                        row.dataset.originalAmount || "",

                    originalUnit:
                        row.dataset.originalUnit || ""

                });

            }
        );


        const calculation =
            calculateRecipeAdjustment(
                recipe
            );


        const rawFinalPPM =
            basePPM +
            calculation.totalAdjustment;


        const finalPPM =
            Math.max(
                rawFinalPPM,
                0.1
            );


        /*
         * 1 ppm = 1 mg/L
         */

        const fraGrams =
            batchSize *
            finalPPM /
            1000.0;


        /*
         * Strict 2% w/w solution.
         */

        const totalSolutionWeight =
            fraGrams /
            0.02;


        const waterGrams =
            totalSolutionWeight -
            fraGrams;


        const result = {

            basePPM: basePPM,

            adjustment:
                calculation.totalAdjustment,

            rawFinalPPM:
                rawFinalPPM,

            finalPPM:
                finalPPM,

            fra:
                fraGrams,

            water:
                waterGrams,

            total:
                totalSolutionWeight,

            ingredients:
                calculation.ingredientBreakdown

        };


        displayResult(
            batchSize,
            result
        );


    } catch (error) {

        showError(
            error.message ||
            "Please enter valid values."
        );

    }


    return false;

}


/* ============================================================
   DISPLAY RESULT
============================================================ */

function displayResult(
    batchSize,
    result
) {

    const resultsCard =
        document.getElementById(
            "results-card"
        );


    resultsCard.classList.remove(
        "hidden"
    );


    document.getElementById(
        "result-batch"
    ).textContent =
        batchSize.toFixed(2) +
        " L";


    document.getElementById(
        "result-base"
    ).textContent =
        result.basePPM.toFixed(2) +
        " ppm";


    const adjustmentElement =
        document.getElementById(
            "result-adjustment"
        );


    adjustmentElement.textContent =
        formatSigned(
            result.adjustment,
            2
        ) +
        " ppm";


    adjustmentElement.classList.remove(
        "positive",
        "negative"
    );


    if (
        result.adjustment < 0
    ) {

        adjustmentElement.classList.add(
            "positive"
        );

    } else if (
        result.adjustment > 0
    ) {

        adjustmentElement.classList.add(
            "negative"
        );

    }


    document.getElementById(
        "result-final"
    ).textContent =
        result.finalPPM.toFixed(2) +
        " ppm";


    document.getElementById(
        "result-fra"
    ).textContent =
        result.fra.toFixed(2) +
        " g";


    document.getElementById(
        "result-water"
    ).textContent =
        result.water.toFixed(0) +
        " ml";


    displayBreakdown(
        result.ingredients,
        result.adjustment
    );


    resultsCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ============================================================
   BREAKDOWN
============================================================ */

function displayBreakdown(
    ingredients,
    totalAdjustment
) {

    const table =
        document.getElementById(
            "breakdown-table"
        );


    table.innerHTML = "";


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "breakdown-row heading";


    heading.innerHTML = `

        <div>Ingredient</div>

        <div>Amount</div>

        <div>Factor</div>

        <div>Adjustment</div>

    `;


    table.appendChild(
        heading
    );

    if (
        ingredients.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "breakdown-row";


        empty.innerHTML = `

            <div>
                No extra FRA ingredients were added. The recipe FRA was used.
            </div>

            <div></div>

            <div></div>

            <div></div>

        `;


        table.appendChild(
            empty
        );

    } else {

        ingredients.forEach(
            function(ingredient) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "breakdown-row";


                const nameCell =
                    document.createElement(
                        "div"
                    );


                nameCell.textContent =
                    ingredient.name;


                if (
                    ingredient.calculation_note
                ) {

                    const warning =
                        document.createElement(
                            "small"
                        );


                    warning.className =
                        "calculation-warning";


                    warning.textContent =
                        ingredient.calculation_note;


                    nameCell.appendChild(
                        warning
                    );

                }


                const amountCell =
                    document.createElement(
                        "div"
                    );


                amountCell.textContent =
                    (
                        Number.isInteger(
                            ingredient.amount
                        )
                            ? ingredient.amount.toFixed(0)
                            : ingredient.amount.toFixed(3)
                    ) +
                    " " +
                            (
                            ingredient.unit.toLowerCase() === "l"
                                ? "L"
                                : ingredient.unit
                            );


                const factorCell =
                    document.createElement(
                        "div"
                    );


                const ingredientData =
                    ingredientDatabase[
                        ingredient.name
                    ];


                const isVolumeBased =
                    ingredient.unit.toLowerCase() === "l" &&
                    ingredientData &&
                    ingredientData.adjustment_per_litre !== undefined;


                factorCell.textContent =
                    formatSigned(
                        isVolumeBased
                            ? ingredientData.adjustment_per_litre
                            : ingredient.adjustment_per_kg,
                        2
                    ) +
                    (isVolumeBased ? " ppm/L" : " ppm/kg");


                const adjustmentCell =
                    document.createElement(
                        "div"
                    );


                adjustmentCell.textContent =
                    formatSigned(
                        ingredient.adjustment,
                        3
                    ) +
                    " ppm";


                if (
                    ingredient.adjustment < 0
                ) {

                    adjustmentCell.classList.add(
                        "positive"
                    );

                } else if (
                    ingredient.adjustment > 0
                ) {

                    adjustmentCell.classList.add(
                        "negative"
                    );

                }


                row.appendChild(
                    nameCell
                );

                row.appendChild(
                    amountCell
                );

                row.appendChild(
                    factorCell
                );

                row.appendChild(
                    adjustmentCell
                );


                table.appendChild(
                    row
                );

            }
        );

    }


    const totalRow =
        document.createElement(
            "div"
        );


    totalRow.className =
        "breakdown-row total-row";


    totalRow.innerHTML = `

        <div>
            Total Recipe Adjustment
        </div>

        <div></div>

        <div></div>

        <div>
            ${formatSigned(totalAdjustment, 3)} ppm
        </div>

    `;


    table.appendChild(
        totalRow
    );

}


/* ============================================================
   ERROR HANDLING
============================================================ */

function showError(
    message
) {

    const element =
        document.getElementById(
            "error-message"
        );


    element.textContent =
        message;


    element.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function hideError() {

    const element =
        document.getElementById(
            "error-message"
        );


    element.classList.add(
        "hidden"
    );

}


/* ============================================================
   FORMATTING
============================================================ */

function formatSigned(
    value,
    decimals
) {

    const number =
        Number(value);


    if (
        number >= 0
    ) {

        return "+" +
            number.toFixed(
                decimals
            );

    }


    return number.toFixed(
        decimals
    );

}


/* ============================================================
   INITIAL INGREDIENTS
============================================================ */

function initialiseCalculator() {

    const selector =
        document.getElementById(
            "recipe-selector"
        );


    const batchInput =
        document.getElementById(
            "batch_size"
        );


    if (
        batchInput
    ) {

        batchInput.addEventListener(
            "input",
            function() {

                const selectedRecipe =
                    recipeDatabase[
                        selector.value
                    ];


                if (
                    selectedRecipe
                ) {

                    updateRecipeFRAAmount(
                        selectedRecipe
                    );

                }

            }
        );

    }


    /*
     * Start with the same custom recipe you
     * had in the Flask application.
     */

    const defaultRecipe = [

        {
            name: "LME",
            amount: 8.25,
            unit: "kg"
        },

        {
            name: "Dextrose",
            amount: 1.30,
            unit: "kg"
        },

        {
            name: "Maltodextrin",
            amount: 0.50,
            unit: "kg"
        },

        {
            name: "Rolled Oats",
            amount: 1.00,
            unit: "kg"
        },

        {
            name: "Pilsner Malt",
            amount: 0.50,
            unit: "kg"
        }

    ];


    defaultRecipe.forEach(
        function(ingredient) {

            addIngredient(
                ingredient
            );

        }
    );


    /*
     * When the user logs out, remove the
     * client-side login flag.
     */

    window.addEventListener(
        "storage",
        function() {

            if (
                localStorage.getItem(
                    "fraLoggedIn"
                ) !== "true"
            ) {

                window.location.href =
                    "login.html";

            }

        }
    );


    /*
     * Ensure selector exists.
     */

    if (!selector) {

        console.error(
            "Recipe selector not found."
        );

    }

}