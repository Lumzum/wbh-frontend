document.addEventListener("DOMContentLoaded", function () {
    const navbarHTML = `
        <header class="bg-gradient-to-r from-blue-500 to-teal-400 text-white p-4 flex justify-between items-center shadow-md">
            <div class="flex items-center gap-3">
                <img src="https://via.placeholder.com/40" alt="Company Logo" class="rounded-full">
                <div>
                    <h2 class="text-lg font-bold">WIN BORN HOLDING</h2>
                    <p class="text-sm opacity-90">Company: <span id="company-label">Loading...</span></p>
                </div>
            </div>
            <div class="flex items-center gap-6">
                <button class="text-white opacity-90 hover:opacity-100"><i class="fas fa-bell"></i></button>
                <button class="text-white opacity-90 hover:opacity-100"><i class="fas fa-th"></i></button>
                <button onclick="toggleLanguage()" class="px-3 py-1 bg-white text-gray-800 font-semibold rounded-md shadow-md">
                    <span id="lang-btn">🇺🇸 EN</span>
                </button>
                <div class="flex items-center gap-2 cursor-pointer">
                    <img src="https://via.placeholder.com/35" class="rounded-full" alt="User">
                    <span id="user-name">Loading...</span>
                </div>
                <button onclick="logout()" class="px-3 py-1 bg-red-500 text-white font-semibold rounded-md shadow-md">Logout</button>
            </div>
        </header>
        <nav class="bg-white shadow-md p-3 flex justify-center">
            <ul class="flex space-x-4 text-gray-700 font-medium">
                <li><a href="dashboard.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">🏠 Dashboard</a></li>
                <li><a href="income.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">💰 Income</a></li>
                <li><a href="expenses.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">💸 Expenses</a></li>
                <li><a href="contacts.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">📇 Contacts</a></li>
                <li><a href="products.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">📦 Products</a></li>
                <li><a href="finances.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">💰 Finances</a></li>
                <li><a href="accounts.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">🏦 Accounts</a></li>
                <li><a href="filevault.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">📂 File Vault</a></li>
                <li><a href="settings.html" class="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-xl">⚙ Settings</a></li>
            </ul>
        </nav>
    `;
    
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);
});
