export const sampleDecks = [
    {
        id: "1",
        name: "JavaScript Fundamentals",
        description: "Core concepts every JS developer should know",
        createdAt: new Date("2024-01-15").toISOString(),
        cards: [
            {
                id: "1-1",
                front: "What is closure in JavaScript?",
                back: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.",
            },
            {
                id: "1-2",
                front: "What is the difference between let and var?",
                back: "let is block-scoped and cannot be redeclared in the same scope, while var is function-scoped and can be redeclared. let also does not hoist in the same way as var.",
            },
            {
                id: "1-3",
                front: "What is the event loop?",
                back: "The event loop is a mechanism that allows JavaScript to perform non-blocking operations by offloading tasks to the browser and executing callbacks when those tasks complete.",
            },
            {
                id: "1-4",
                front: "What are promises?",
                back: "Promises are objects representing the eventual completion or failure of an asynchronous operation, allowing you to handle async code more elegantly than callbacks.",
            },
            {
                id: "1-5",
                front: "What is the spread operator?",
                back: "The spread operator (...) allows an iterable like an array to be expanded in places where zero or more arguments or elements are expected.",
            },
            {
                id: "1-6",
                front: "What is destructuring?",
                back: "Destructuring is a syntax that allows you to unpack values from arrays or properties from objects into distinct variables.",
            },
            {
                id: "1-7",
                front: "What is the difference between == and ===?",
                back: "== performs type coercion before comparison, while === (strict equality) compares both value and type without coercion.",
            },
            {
                id: "1-8",
                front: "What is hoisting?",
                back: "Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution, allowing variables and functions to be used before they are declared.",
            },
        ],
    },
    {
        id: "2",
        name: "React Essentials",
        description: "Key React concepts and hooks",
        createdAt: new Date("2024-02-01").toISOString(),
        cards: [
            {
                id: "2-1",
                front: "What is useState?",
                back: "useState is a React Hook that lets you add state to functional components. It returns an array with the current state value and a function to update it.",
            },
            {
                id: "2-2",
                front: "What is useEffect?",
                back: "useEffect is a Hook that lets you perform side effects in functional components. It runs after render and can optionally clean up before the next effect or unmount.",
            },
            {
                id: "2-3",
                front: "What is the virtual DOM?",
                back: "The virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize updates by comparing changes and only updating the parts of the real DOM that changed.",
            },
            {
                id: "2-4",
                front: "What are props?",
                back: "Props (properties) are read-only data passed from parent to child components, allowing components to be reusable and configurable.",
            },
            {
                id: "2-5",
                front: "What is useContext?",
                back: "useContext is a Hook that lets you subscribe to React context without nesting, allowing you to share data across the component tree without prop drilling.",
            },
            {
                id: "2-6",
                front: "What is the key prop?",
                back: "The key prop is a special attribute that helps React identify which items have changed, been added, or removed in lists, optimizing reconciliation.",
            },
        ],
    },
];
