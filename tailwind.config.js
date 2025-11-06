import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
        './resources/js/**/*.js',
    ],
    // Tailwind config only scans .vue files, not .js files.
    // The classes in state.js may not be detected.
    // Adding these classes to the Tailwind safelist so they are always included in the build.
    safelist: [
        'bg-green-100',
        'text-green-800',
        'bg-red-100',
        'text-red-800',
        'bg-yellow-100',
        'text-yellow-800',
        'bg-blue-100',
        'text-blue-800',
        'bg-indigo-100',
        'text-indigo-800',
        'bg-gray-100',
        'text-gray-800',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
};

