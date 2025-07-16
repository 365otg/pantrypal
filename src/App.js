import React, { useState, useEffect, useMemo } from 'react';
import { ChefHat, Sparkles, UtensilsCrossed, CheckCircle, ShoppingCart, Loader, Zap, Star, Leaf, Clock, Heart, Wand2, Lock, User, RefreshCw, CalendarDays, Award, Printer, Soup, Salad, Lightbulb, Home, Users, ChevronLeft, ChevronRight, KeyRound, AlertTriangle } from 'lucide-react';

// --- Mock Data ---
const mockPopularRecipes = [
    { recipeName: "Creamy Tuscan Chicken", difficulty: "Medium" },
    { recipeName: "One-Pan Lemon Herb Salmon & Asparagus", difficulty: "Easy" },
    { recipeName: "Spicy Black Bean Burgers", difficulty: "Medium" },
    { recipeName: "Garlic Butter Shrimp Scampi", difficulty: "Easy" },
];

// --- UI Components (Defined before use) ---

const Navbar = ({ setView, isPro }) => {
    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm border-b border-green-100 no-print">
            <nav className="container mx-auto p-4 flex justify-between items-center">
                <a href="#" onClick={(e) => {e.preventDefault(); window.location.reload();}} className="flex items-center gap-2 text-2xl font-bold text-green-900 font-lora">
                    <ChefHat />
                    PantryPal
                </a>
                {isPro && (
                     <button onClick={() => setView('profile')} className="font-semibold text-stone-600 hover:text-green-700 flex items-center gap-1"><User size={16}/> My Profile</button>
                )}
            </nav>
        </header>
    );
};

const Recommendations = ({ isPro, setShowPaywall, onSelect }) => {
    return (
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-stone-200 relative">
            <h2 className="text-xl font-bold font-lora text-stone-800 mb-4 flex items-center gap-2"><Users /> Community Favorites</h2>
            <div className="relative">
                {!isPro && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 -m-6 p-6">
                        <Lock className="text-stone-400 mb-2" size={32}/>
                        <p className="font-semibold text-stone-600 text-center">Upgrade to Pro to see what's popular!</p>
                        <button onClick={() => setShowPaywall(true)} className="mt-2 bg-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-sm hover:bg-green-800 transition-colors button-transition">Unlock</button>
                    </div>
                )}
                <ul className="space-y-2">
                    {mockPopularRecipes.map((recipe, index) => (
                        <li key={index} className="text-stone-700 p-2 bg-green-50/50 rounded-md flex justify-between items-center">
                            <span>{recipe.recipeName}</span>
                            <button onClick={() => onSelect(recipe.recipeName)} className="text-xs font-bold text-green-800 hover:underline">View</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const RecipeListItem = ({ recipe, index, onSave, isSaved, isPro, isLocked, setShowPaywall, proLevel }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true); // Expanded by default
    const difficultyColors = { 'Easy': 'bg-green-100 text-green-800', 'Medium': 'bg-yellow-100 text-yellow-800', 'Hard': 'bg-red-100 text-red-800' };
    
    const handleSaveClick = () => {
        if (isSaved) {
            setShowConfirmation(true);
        } else {
            onSave(recipe);
        }
    };

    const confirmRemove = () => {
        onSave(recipe);
        setShowConfirmation(false);
    };

    const isProPlus = proLevel === 'pro_plus';

    return (
        <div className="bg-white/90 rounded-2xl shadow-lg overflow-hidden animate-fade-in-up border border-stone-200" style={{animationDelay: `${index * 150}ms`}}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-2xl font-bold text-stone-800 font-lora">{recipe.recipeName}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${difficultyColors[recipe.difficulty] || 'bg-gray-100 text-gray-800'}`}>{recipe.difficulty}</span>
                        {onSave && (
                            <button onClick={(e) => { e.stopPropagation(); handleSaveClick(); }} className={`p-2 rounded-full transition-all duration-200 ${isSaved ? 'bg-red-100 text-red-500' : 'bg-stone-100 text-stone-500 hover:bg-red-100 hover:text-red-500'}`}>
                                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                            </button>
                        )}
                    </div>
                </div>
                 <div className="flex items-center gap-2 text-sm text-stone-400 mb-4">
                    <Clock size={14} />
                    <span>{recipe.cookingTime || 'N/A'}</span>
                </div>
                
                <div className="relative">
                    {isLocked && (
                         <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 -m-6 p-6">
                            <Lock className="text-stone-400 mb-2" size={32}/>
                            <p className="font-semibold text-stone-600 text-center">Upgrade to Pro to see this recipe and more!</p>
                             <button onClick={() => setShowPaywall(true)} className="mt-2 bg-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-sm hover:bg-green-800 transition-colors button-transition">Unlock</button>
                        </div>
                    )}
                    <div className="space-y-4">
                        {recipe.magicIngredient && (
                            <div className={`p-3 rounded-lg flex items-center gap-3 relative overflow-hidden bg-yellow-50 border border-yellow-200`}>
                                <Wand2 className="flex-shrink-0 text-yellow-600" size={20}/>
                                <p className="text-sm text-yellow-800">
                                    <span className="font-bold">Magic Ingredient:</span> {recipe.magicIngredient}
                                </p>
                            </div>
                        )}
                        {recipe.suggestedSides && (
                             <div className={`p-3 rounded-lg flex items-center gap-3 relative overflow-hidden ${isProPlus ? 'bg-blue-50 border border-blue-200' : 'bg-stone-100 border border-stone-200'}`}>
                                <Salad className={`flex-shrink-0 ${isProPlus ? 'text-blue-600' : 'text-stone-400'}`} size={20}/>
                                <p className={`text-sm ${isProPlus ? 'text-blue-800' : 'text-stone-500'}`}>
                                    <span className="font-bold">Suggested Sides:</span> {isProPlus ? recipe.suggestedSides.join(', ') : "Upgrade to Pro+ to reveal!"}
                                </p>
                            </div>
                        )}
                         {recipe.spiceBlend && (
                             <div className={`p-3 rounded-lg flex items-center gap-3 relative overflow-hidden ${isProPlus ? 'bg-orange-50 border border-orange-200' : 'bg-stone-100 border border-stone-200'}`}>
                                <Soup className={`flex-shrink-0 ${isProPlus ? 'text-orange-600' : 'text-stone-400'}`} size={20}/>
                                <p className={`text-sm ${isProPlus ? 'text-orange-800' : 'text-stone-500'}`}>
                                    <span className="font-bold">Spice Blend:</span> {isProPlus ? recipe.spiceBlend : "Upgrade to Pro+ to reveal!"}
                                </p>
                            </div>
                        )}
                        <div className="border-t border-stone-200 pt-4 relative">
                            <h4 className="font-semibold text-stone-700 mb-2 flex items-center font-lora"><UtensilsCrossed className="mr-2" size={18}/> Instructions</h4>
                            <ol className={`list-decimal list-inside space-y-2 text-stone-600`}>
                                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                         {recipe.proTips && (
                             <div className={`mt-4 p-3 rounded-lg relative overflow-hidden ${isPro ? 'bg-teal-50 border border-teal-200' : 'bg-stone-100 border border-stone-200'}`}>
                                <h4 className={`font-semibold mb-1 flex items-center gap-2 ${isPro ? 'text-teal-800' : 'text-stone-500'}`}><Lightbulb size={16}/> Pro Tip</h4>
                                <p className={`text-sm ${isPro ? 'text-teal-700' : 'text-stone-500'}`}>{isPro ? recipe.proTips : "Upgrade to Pro to reveal exclusive cooking tips!"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm animate-fade-in-up p-6 text-center">
                        <AlertTriangle className="mx-auto text-red-500" size={48} />
                        <h3 className="text-lg font-bold mt-4">Are you sure?</h3>
                        <p className="text-sm text-stone-600 mt-2">Do you want to remove this recipe from your favorites?</p>
                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setShowConfirmation(false)} className="w-full py-2 px-4 bg-stone-200 hover:bg-stone-300 rounded-lg font-semibold transition-colors">Cancel</button>
                            <button onClick={confirmRemove} className="w-full py-2 px-4 bg-red-600 text-white hover:bg-red-700 rounded-lg font-semibold transition-colors">Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const HomePage = ({ isPro, proLevel, setShowPaywall, setPendingAction, toggleFavorite, favorites, addRecentSearch, setView, ingredients, setIngredients, recipes, setRecipes, isLoading, setIsLoading, error, setError }) => {
    
    const [difficulty, setDifficulty] = useState('');
    const [recipeCount, setRecipeCount] = useState(3);
    const [filters, setFilters] = useState({ quick: false, healthy: false, vegetarian: false });
    const [cuisine, setCuisine] = useState('');
    const [servingSize, setServingSize] = useState(2);
    
    const isProPlus = proLevel === 'pro_plus';

    const handleFindRecipes = async (currentIngredients, currentProLevel) => {
        if (!currentIngredients.trim()) {
            setError('Please enter some ingredients.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        const currentRecipeCount = currentProLevel !== 'none' ? recipeCount : 3;
        
        let proFeaturesText = `Also, include a "cookingTime" (string, e.g., "25 minutes").`;
        if (currentProLevel !== 'none') {
            proFeaturesText += ` Also, include suggestions for "suggestedSides" (an array of strings), "proTips" (a string with cooking advice), "magicIngredient" (string).`;
        }
        if (currentProLevel === 'pro_plus') {
             proFeaturesText += ` Also include "spiceBlend" (a string with spice ideas) and "platingSuggestion" (a string on how to present the dish).`
        }

        let filterText = '';
        if (currentProLevel !== 'none') {
            const activeFilters = Object.entries(filters).filter(([, value]) => value).map(([key]) => key);
            if (activeFilters.length > 0) filterText += `The recipes should also be: ${activeFilters.join(', ')}. `;
            if (cuisine.trim()) filterText += `The cuisine style should be ${cuisine}. `;
        }
        
        const prompt = `
            You are a creative chef. Given the following ingredients, generate ${currentRecipeCount} simple and delicious recipe ideas with a mix of easy, medium, and hard difficulties.
            The user has these ingredients: ${currentIngredients}.
            ${filterText}
            ${proFeaturesText}
            Assume the user also has common staples like salt, pepper, oil, water, and basic spices.
            The recipes should primarily use the ingredients provided.
            IMPORTANT: Respond with ONLY a valid JSON array of objects. Each object must have: "recipeName" (string), "difficulty" (string: "Easy", "Medium", or "Hard"), "cookingTime" (string), "instructions" (an array of strings).
            If the user is a pro, also include "magicIngredient" (string) and "proTips" (string).
            If the user is pro_plus, also include "suggestedSides" (array of strings), "spiceBlend" (string), and "platingSuggestion" (string).
            Do not include any other text or explanation outside of the JSON array.
        `;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        };
        
        const apiKey = ""; // Keep this empty
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0) {
                const jsonText = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(jsonText);
                setRecipes(parsedJson);
                addRecentSearch(currentIngredients);
            } else {
                setError("Sorry, I couldn't think of any recipes.");
            }
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const sortedRecipes = useMemo(() => {
        if (!difficulty) return recipes;
        return [...recipes].sort((a, b) => {
            if (a.difficulty === difficulty) return -1;
            if (b.difficulty === difficulty) return 1;
            return 0;
        });
    }, [recipes, difficulty]);

    const triggerProFeature = (action, isSearchRelated = false) => {
        if (!isPro) {
            setShowPaywall(true);
            setPendingAction(() => (newProLevel) => {
                action();
                if (isSearchRelated && ingredients.trim()) {
                    setTimeout(() => handleFindRecipes(ingredients, newProLevel), 0);
                }
            });
        } else {
            action();
        }
    };
    
    const handleFilterChange = (filter) => triggerProFeature(() => setFilters(prev => ({...prev, [filter]: !prev[filter]})), true);
    const handleDifficultySort = (newDifficulty) => setDifficulty(d => d === newDifficulty ? '' : newDifficulty);
    const handleRecipeCountChange = (e) => triggerProFeature(() => setRecipeCount(e.target.value), true);
    const handleCuisineChange = (e) => triggerProFeature(() => setCuisine(e.target.value), true);
    const handleServingSizeChange = (e) => triggerProFeature(() => setServingSize(e.target.value), true);
    const handleMealPlanClick = () => {
        if (!isProPlus) {
            setShowPaywall(true);
            setPendingAction(() => () => setView('mealPlan'));
        } else {
            setView('mealPlan');
        }
    }
    
    const handleSearchClick = () => {
        const hasProFilters = Object.values(filters).some(v => v) || cuisine || (isPro && recipeCount > 3) || servingSize !== 2;
        if (hasProFilters && !isPro) {
            setShowPaywall(true);
            setPendingAction(() => () => handleFindRecipes(ingredients, 'pro'));
        } else {
            handleFindRecipes(ingredients, proLevel);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleCommunityFavoriteClick = (recipeName) => {
        setIngredients(recipeName);
        handleFindRecipes(recipeName, proLevel);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-68px)]">
            <div className="container mx-auto p-4 md:p-8 max-w-4xl w-full">
                <header className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-6xl font-bold text-stone-800 font-lora">PantryPal</h1>
                    <p className="text-stone-600 mt-2 text-lg">What can we make with what you have?</p>
                </header>
                <main>
                    <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in-up border border-stone-200" style={{animationDelay: '100ms'}}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} onKeyPress={handleKeyPress} placeholder="e.g., chicken, rice, broccoli, garlic..." className="w-full px-5 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 transition-shadow" />
                            <button onClick={handleSearchClick} disabled={isLoading} className="w-full md:w-auto px-8 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-400 flex items-center justify-center button-transition">
                                {isLoading ? <><Loader className="animate-spin mr-2" size={20} />Thinking...</> : <><Sparkles className="mr-2" size={20} />Find Recipes</>}
                            </button>
                        </div>
                    </div>
                    
                    {recipes.length > 0 && (
                        <div className="mt-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-stone-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold font-lora text-stone-800">Pro Features</h2>
                                    {!isPro && <button onClick={() => setShowPaywall(true)} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-green-800 transition-colors button-transition">Upgrade Now</button>}
                                </div>
                                <div className="mt-4 pt-4 border-t border-stone-200 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-stone-700 flex-shrink-0">Lifestyle:</h3>
                                            <FilterButton icon={<Clock size={16}/>} label="Quick" isActive={filters.quick} onClick={() => handleFilterChange('quick')} isPro={isPro} />
                                            <FilterButton icon={<Star size={16}/>} label="Healthy" isActive={filters.healthy} onClick={() => handleFilterChange('healthy')} isPro={isPro} />
                                            <FilterButton icon={<Leaf size={16}/>} label="Vegetarian" isActive={filters.vegetarian} onClick={() => handleFilterChange('vegetarian')} isPro={isPro} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-stone-700 flex-shrink-0">Cuisine:</h3>
                                            <input type="text" value={cuisine} onChange={handleCuisineChange} placeholder="e.g. Italian" className={`px-3 py-1 border border-stone-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-green-700 w-full ${!isPro ? 'cursor-not-allowed bg-stone-100' : ''}`} disabled={!isPro} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="serving-size" className="font-semibold text-stone-700">Servings:</label>
                                        <input type="number" id="serving-size" min="1" max="12" value={servingSize} onChange={handleServingSizeChange} className={`w-20 px-3 py-1 border border-stone-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-green-700 ${!isPro ? 'cursor-not-allowed bg-stone-100' : ''}`} disabled={!isPro} />
                                    </div>
                                    <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="recipe-count" className="font-semibold text-stone-700">Recipes:</label>
                                            <input type="range" id="recipe-count" min="3" max={isProPlus ? "20" : "10"} value={isPro ? recipeCount : 3} onChange={handleRecipeCountChange} className={`w-48 ${!isPro ? 'cursor-not-allowed' : 'cursor-pointer'}`} disabled={!isPro} />
                                            <span className="font-bold text-green-800 w-8 text-center">{isPro ? recipeCount : 3}</span>
                                        </div>
                                        <button onClick={handleMealPlanClick} disabled={!isProPlus} className="w-full sm:w-auto px-6 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center button-transition relative">
                                            {!isProPlus && <Lock size={12} className="absolute top-1 right-1 text-yellow-400" />}
                                            <CalendarDays className="mr-2" size={18} />
                                            Generate Weekly Meal Plan
                                        </button>
                                    </div>
                                    {isPro && !isProPlus && (
                                        <p className="text-center text-xs text-stone-500">Upgrade to <button onClick={() => setShowPaywall(true)} className="font-bold text-green-800 hover:underline">Pro+</button> to generate a meal plan.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12">
                         {recipes.length > 0 && (
                            <>
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="font-semibold text-stone-700 flex-shrink-0">Sort by:</h3>
                                    <SortButton label="Easy" isActive={difficulty === 'Easy'} onClick={() => handleDifficultySort('Easy')} />
                                    <SortButton label="Medium" isActive={difficulty === 'Medium'} onClick={() => handleDifficultySort('Medium')} />
                                    <SortButton label="Hard" isActive={difficulty === 'Hard'} onClick={() => handleDifficultySort('Hard')} />
                                </div>
                                <div className="space-y-8">
                                    {sortedRecipes.map((recipe, index) => (
                                        <RecipeListItem key={index} recipe={recipe} index={index} onSave={toggleFavorite} isSaved={favorites.some(fav => fav.recipeName === recipe.recipeName)} isPro={isPro} isLocked={!isPro && index >= 3} setShowPaywall={setShowPaywall} proLevel={proLevel} />
                                    ))}
                                </div>
                                <div className="mt-12">
                                    <Recommendations isPro={isPro} setShowPaywall={setShowPaywall} onSelect={handleCommunityFavoriteClick} />
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const ProfilePage = ({ favorites, toggleFavorite, recentSearches, proLevel, setView }) => {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const recipesPerPage = 5;

    const uniqueIngredients = useMemo(() => {
        const allIngredients = new Set();
        favorites.forEach(recipe => {
            const words = recipe.recipeName.toLowerCase().split(' ');
            const common = ['and', 'with', 'in', 'a', 'the', 'of'];
            const importantWords = words.filter(word => !common.includes(word) && word.length > 3);
            importantWords.slice(0, 2).forEach(word => allIngredients.add(word.charAt(0).toUpperCase() + word.slice(1)));
        });
        return Array.from(allIngredients);
    }, [favorites]);

    const filteredFavorites = useMemo(() => {
        if (!filter) return favorites;
        return favorites.filter(recipe => recipe.recipeName.toLowerCase().includes(filter.toLowerCase()));
    }, [favorites, filter]);

    // Pagination logic
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredFavorites.slice(indexOfFirstRecipe, indexOfLastRecipe);
    const totalPages = Math.ceil(filteredFavorites.length / recipesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-stone-200 mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-bold text-stone-800 font-lora">My Profile</h1>
                <div className="mt-4 border-t border-stone-200 pt-4 text-stone-600 space-y-2">
                    <p><strong>Email:</strong> user@example.com (Simulated)</p>
                    <p><strong>Membership:</strong> <span className={`font-bold ${proLevel === 'pro_plus' ? 'text-purple-700' : 'text-green-700'}`}>{proLevel === 'pro_plus' ? 'Pro+' : (proLevel === 'pro' ? 'Pro' : 'Free')}</span></p>
                    <button onClick={() => setShowPasswordModal(true)} className="text-sm text-green-800 font-semibold hover:underline flex items-center gap-1"><KeyRound size={14}/> Change Password</button>
                </div>
            </div>
            
            <div className="mb-12 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                 <h2 className="text-3xl font-bold text-stone-800 font-lora mb-4">Recent Searches</h2>
                 <div className="bg-white/70 p-4 rounded-2xl shadow-lg border border-stone-200">
                    {recentSearches.length > 0 ? (
                        <ul className="space-y-2">
                            {recentSearches.map((search, index) => (
                                <li key={index} className="text-stone-700 p-2 bg-stone-50 rounded-md">{search}</li>
                            ))}
                        </ul>
                    ) : (
                         <p className="text-center text-stone-600">No recent searches.</p>
                    )}
                 </div>
            </div>

            <h2 className="text-3xl font-bold text-stone-800 font-lora mb-4 animate-fade-in-up" style={{animationDelay: '200ms'}}>My Favorite Recipes</h2>
            <div className="mb-8 animate-fade-in-up" style={{animationDelay: '250ms'}}>
                <div className="flex flex-wrap gap-2">
                    <SortButton label="All" isActive={!filter} onClick={() => setFilter('')} />
                    {uniqueIngredients.map(ing => (
                        <SortButton key={ing} label={ing} isActive={filter === ing} onClick={() => setFilter(f => f === ing ? '' : ing)} />
                    ))}
                </div>
            </div>

            {currentRecipes.length > 0 ? (
                <div className="space-y-8">
                    {currentRecipes.map((recipe, index) => (
                        <RecipeListItem key={index} recipe={recipe} index={index} onSave={toggleFavorite} isSaved={true} isPro={true} proLevel={proLevel} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-stone-600 animate-fade-in-up" style={{animationDelay: '300ms'}}>You haven't saved any recipes yet.</p>
            )}
            
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    {currentPage > 1 && filteredFavorites.length > 10 && (
                        <button onClick={() => paginate(currentPage - 1)} className="p-2 rounded-full hover:bg-stone-200"><ChevronLeft size={20}/></button>
                    )}
                    {Array.from({length: totalPages}, (_, i) => i + 1).map(number => (
                        <button key={number} onClick={() => paginate(number)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${currentPage === number ? 'bg-green-700 text-white' : 'bg-white hover:bg-stone-50'}`}>
                            {number}
                        </button>
                    ))}
                    {currentPage < totalPages && filteredFavorites.length > 10 && (
                        <button onClick={() => paginate(currentPage + 1)} className="p-2 rounded-full hover:bg-stone-200"><ChevronRight size={20}/></button>
                    )}
                </div>
            )}

             <button onClick={() => setView('home')} className="mt-8 bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-green-800 transition-colors button-transition flex items-center mx-auto"><Home className="mr-2" size={16}/> Back to Home</button>
             <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
    );
};

const MealPlanPage = ({ setView, ingredients, mealPlan, setMealPlan }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generatePlan = async () => {
            if (!ingredients) {
                // Use a default plan if no ingredients are provided
                const defaultPlan = {
                    Monday: { recipeName: "Simple Chicken & Rice", difficulty: "Easy", instructions: ["Cook chicken.", "Cook rice.", "Combine and serve."] },
                    Tuesday: { recipeName: "Quick Tomato Pasta", difficulty: "Easy", instructions: ["Boil pasta.", "Heat tomato sauce.", "Mix and top with cheese."] },
                    Wednesday: { recipeName: "Lentil Soup", difficulty: "Medium", instructions: ["Sauté onions and carrots.", "Add lentils and broth.", "Simmer for 30 minutes."] },
                    Thursday: { recipeName: "Pan-Seared Salmon", difficulty: "Easy", instructions: ["Season salmon fillets.", "Sear in a hot pan for 4-5 minutes per side.", "Serve with lemon."] },
                    Friday: { recipeName: "Homemade Pizza", difficulty: "Medium", instructions: ["Roll out dough.", "Add sauce, cheese, and toppings.", "Bake at 450°F for 12-15 minutes."] },
                    Saturday: { recipeName: "Beef Tacos", difficulty: "Easy", instructions: ["Brown ground beef with taco seasoning.", "Warm tortillas.", "Assemble with your favorite toppings."] },
                    Sunday: { recipeName: "Classic Roast Chicken", difficulty: "Hard", instructions: ["Season whole chicken.", "Roast at 400°F for 1.5 hours.", "Let rest before carving."] }
                };
                setMealPlan(defaultPlan);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const prompt = `
                You are a meal planning expert. Based on these ingredients: ${ingredients}, create a 7-day dinner meal plan.
                Provide the response as a JSON object where keys are the days of the week (Monday, Tuesday, etc.) and values are full recipe objects.
                Each recipe object must have: "recipeName" (string), "difficulty" (string: "Easy", "Medium", or "Hard"), and "instructions" (an array of strings).
            `;
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            };
            const apiKey = ""; // Keep empty
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error("API Error");
                const result = await response.json();
                const jsonText = result.candidates[0].content.parts[0].text;
                setMealPlan(JSON.parse(jsonText));
            } catch (e) {
                console.error("Meal plan generation failed", e);
                // Fallback to default plan on error
                generatePlan();
            } finally {
                setIsLoading(false);
            }
        };

        generatePlan();
    }, [ingredients, setMealPlan]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportToCalendar = () => {
        if (!mealPlan) return;
        let cal = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//PantryPal//Meal Plan//EN'
        ];

        const today = new Date();
        Object.entries(mealPlan).forEach(([day, meal], index) => {
            const eventDate = new Date(today);
            eventDate.setDate(today.getDate() + index);
            const dateStr = eventDate.toISOString().split('T')[0].replace(/-/g, '');
            
            cal.push('BEGIN:VEVENT');
            cal.push(`DTSTART;VALUE=DATE:${dateStr}`);
            cal.push(`DTEND;VALUE=DATE:${dateStr}`);
            cal.push(`SUMMARY:Dinner: ${meal.recipeName}`);
            cal.push(`DESCRIPTION:Instructions: ${meal.instructions.join(' ')}`);
            cal.push('END:VEVENT');
        });

        cal.push('END:VCALENDAR');
        
        const blob = new Blob([cal.join('\r\n')], {type: 'text/calendar;charset=utf-8'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pantrypal_meal_plan.ics';
        link.click();
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8 no-print">
                <h1 className="text-4xl font-bold text-stone-800 font-lora">Your Weekly Meal Plan</h1>
                <div className="flex gap-2">
                    <button onClick={handleExportToCalendar} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-semibold hover:bg-stone-50 button-transition"><CalendarDays size={16}/> Export</button>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-semibold hover:bg-stone-50 button-transition"><Printer size={16}/> Print</button>
                </div>
            </div>
            {isLoading ? (
                <div className="text-center p-10"><Loader className="animate-spin text-red-800" size={32}/></div>
            ) : (
                <div id="printable-meal-plan" className="bg-white/80 p-8 rounded-2xl shadow-lg border border-stone-200">
                    <h2 className="text-center text-2xl font-lora font-bold mb-6">7-Day Dinner Plan</h2>
                    <div className="space-y-6">
                        {mealPlan && Object.entries(mealPlan).map(([day, recipe]) => (
                             <div key={day} className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                                <h3 className="font-bold font-lora text-green-800 text-xl">{day}</h3>
                                <RecipeListItem recipe={recipe} index={0} onSave={()=>{}} isSaved={false} isPro={true} proLevel={'pro_plus'} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button onClick={() => setView('home')} className="mt-8 bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-green-800 transition-colors button-transition no-print">Back to Home</button>
        </div>
    );
};

const FilterButton = ({ icon, label, isActive, onClick, isPro }) => (
    <button onClick={onClick} className={`relative flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-semibold transition-colors ${isActive && isPro ? 'bg-green-700 text-white border-green-700' : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'} ${!isPro ? 'cursor-not-allowed opacity-70' : ''}`}>
        {!isPro && <Lock size={10} className="absolute -top-1 -right-1 text-yellow-600 bg-white rounded-full p-0.5" />}
        {icon}
        {label}
    </button>
);

const SortButton = ({ label, isActive, onClick }) => (
     <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-semibold transition-colors ${isActive ? 'bg-green-700 text-white border-green-700' : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'}`}>
        {label}
    </button>
);

const PaymentScreen = ({ onPaymentSuccess }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
            <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in-up border border-stone-200">
                <Zap className="mx-auto text-yellow-500" size={48} />
                <h1 className="text-3xl font-bold text-stone-800 font-lora mt-4">Upgrade to PantryPal Pro</h1>
                <p className="text-stone-600 mt-2">Unlock advanced features to supercharge your meal planning.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pro Tier */}
                    <div className="border border-stone-200 rounded-xl p-6 flex flex-col">
                        <h2 className="text-2xl font-bold font-lora text-green-800">Pro</h2>
                        <p className="text-4xl font-bold text-stone-800 my-4">$1.99</p>
                        <p className="text-stone-500 mb-6">One-time payment</p>
                        <ul className="text-left space-y-3 text-stone-600 mb-8 flex-grow">
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> Unlock all recipe results.</li>
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> Use advanced filters.</li>
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> Get "Magic Ingredient" & Pro Tips.</li>
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> Save your favorite recipes.</li>
                        </ul>
                        <button onClick={() => onPaymentSuccess('pro')} className="w-full px-6 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-all duration-300 flex items-center justify-center button-transition">
                            <ShoppingCart className="mr-2" size={20} /> Unlock Pro
                        </button>
                    </div>
                    {/* Pro+ Tier */}
                    <div className="border-2 border-yellow-500 rounded-xl p-6 flex flex-col relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">Most Popular</div>
                        <h2 className="text-2xl font-bold font-lora text-purple-800 flex items-center justify-center gap-2"><Award/> Pro+</h2>
                        <p className="text-4xl font-bold text-stone-800 my-4">$4.99</p>
                        <p className="text-stone-500 mb-6">One-time payment</p>
                        <ul className="text-left space-y-3 text-stone-600 mb-8 flex-grow">
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> <span className="font-bold">All Pro features, plus:</span></li>
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> Generate up to 20 recipes.</li>
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> Generate Weekly Meal Plans.</li>
                            <li className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20} /> Export to Print & Calendar.</li>
                        </ul>
                        <button onClick={() => onPaymentSuccess('pro_plus')} className="w-full px-6 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-all duration-300 flex items-center justify-center button-transition">
                            <ShoppingCart className="mr-2" size={20} /> Unlock Pro+
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('');
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Password changed successfully! (Simulated)');
        setTimeout(() => {
            setMessage('');
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md animate-fade-in-up">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-stone-800 font-lora">Change Password</h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800">&times;</button>
                </div>
                <div className="p-6">
                    {message ? (
                        <p className="text-center text-green-600">{message}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="password" placeholder="Current Password" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"/>
                            <input type="password" placeholder="New Password" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"/>
                            <input type="password" placeholder="Confirm New Password" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"/>
                            <button type="submit" className="w-full px-6 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-all duration-300 button-transition">Update Password</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
// This is the main export that will be rendered.
export default function App() {
    const [view, setView] = useState('home');
    const [isPro, setIsPro] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showPaywall, setShowPaywall] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // State lifted from HomePage
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Load Pro status and saved data from localStorage on initial render
    useEffect(() => {
        try {
            const savedProStatus = localStorage.getItem('pantrypal_isPro');
            if (savedProStatus === 'true') {
                setIsPro(true);
            }

            const savedFavorites = localStorage.getItem('pantrypal_favorites');
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            }
            
            const savedSearches = localStorage.getItem('pantrypal_recentSearches');
            if (savedSearches) {
                setRecentSearches(JSON.parse(savedSearches));
            }
        } catch (e) {
            console.error("Error loading data from localStorage", e);
        }
    }, []);

    const handlePaymentSuccess = () => {
        setIsPro(true);
        localStorage.setItem('pantrypal_isPro', 'true');
        setShowPaywall(false);
        if (pendingAction) {
            // Automatically run the action the user was trying to do
            pendingAction(true); // Pass new pro status
            setPendingAction(null);
        }
    };

    const toggleFavorite = (recipe) => {
        if (!isPro) {
            setShowPaywall(true);
            setPendingAction(() => () => toggleFavorite(recipe)); // Save the specific action
            return;
        }
        let updatedFavorites;
        const isFavorited = favorites.some(fav => fav.recipeName === recipe.recipeName);

        if (isFavorited) {
            updatedFavorites = favorites.filter(fav => fav.recipeName !== recipe.recipeName);
        } else {
            updatedFavorites = [...favorites, recipe];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('pantrypal_favorites', JSON.stringify(updatedFavorites));
    };
    
    const addRecentSearch = (searchIngredients) => {
        const updatedSearches = [searchIngredients, ...recentSearches.filter(s => s !== searchIngredients)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('pantrypal_recentSearches', JSON.stringify(updatedSearches));
    };
    
    const renderView = () => {
        if (showPaywall) {
            return <PaymentScreen onPaymentSuccess={handlePaymentSuccess} />;
        }
        switch(view) {
            case 'profile':
                return <ProfilePage favorites={favorites} toggleFavorite={toggleFavorite} recentSearches={recentSearches} setView={setView} isPro={isPro} />;
            case 'mealPlan':
                return <MealPlanPage setView={setView} ingredients={ingredients} mealPlan={mealPlan} setMealPlan={setMealPlan} />;
            case 'home':
            default:
                return <HomePage 
                            isPro={isPro}
                            setShowPaywall={setShowPaywall}
                            setPendingAction={setPendingAction}
                            toggleFavorite={toggleFavorite}
                            favorites={favorites}
                            addRecentSearch={addRecentSearch}
                            setView={setView}
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            recipes={recipes}
                            setRecipes={setRecipes}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            error={error}
                            setError={setError}
                        />;
        }
    };

    return (
        <div className="min-h-screen bg-green-50/50 font-lato text-stone-800 farmhouse-background">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Lato:wght@400;700&display=swap');
                body { font-family: 'Lato', sans-serif; }
                .font-lora { font-family: 'Lora', serif; }
                .farmhouse-background {
                    background-color: #f0fdf4;
                }
                 .animate-fade-in-up { 
                    animation: fadeInUp 0.6s ease-out forwards; 
                    opacity: 0;
                 }
                @keyframes fadeInUp { 
                    from { opacity: 0; transform: translateY(20px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
                .button-transition {
                    transition: transform 0.1s ease-out, background-color 0.2s ease;
                }
                .button-transition:hover {
                    transform: translateY(-2px);
                }
                .button-transition:active {
                    transform: translateY(0px);
                }
                .no-select {
                    -webkit-user-select: none; /* Safari */
                    -ms-user-select: none; /* IE 10 and IE 11 */
                    user-select: none; /* Standard syntax */
                }
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #printable-meal-plan, #printable-meal-plan * {
                        visibility: visible;
                    }
                    #printable-meal-plan {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
            <Navbar setView={setView} isPro={isPro} />
            {renderView()}
        </div>
    );
};
