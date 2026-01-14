export const mockShops = [
    {
        id: 101,
        name: "Burger King",
        owner: "Bob Smith",
        status: "approved",
        revenue: 5400,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
        menu: [
            { id: 'm1', name: "Whopper", price: 199, category: "Burgers", available: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
            { id: 'm2', name: "Chicken Fries", price: 149, category: "Sides", available: true, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80" },
            { id: 'm3', name: "Coke", price: 60, category: "Drinks", available: true, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" }
        ]
    },
    {
        id: 102,
        name: "Pizza Hut",
        owner: "John Doe",
        status: "disabled",
        revenue: 3200,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
        menu: [
            { id: 'm4', name: "Pepperoni Pizza", price: 499, category: "Pizzas", available: true, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80" },
            { id: 'm5', name: "Garlic Bread", price: 129, category: "Sides", available: false, image: "https://images.unsplash.com/photo-1573140247632-f84660f67627?w=500&q=80" }
        ]
    },
    {
        id: 103,
        name: "Subway",
        owner: "Jane Roe",
        status: "approved",
        revenue: 7800,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1594957640201-90b9b46f53bd?w=500&q=80",
        menu: [
            { id: 'm6', name: "Veggie Delite", price: 229, category: "Subs", available: true, image: "https://images.unsplash.com/photo-1509722747713-09247f329f74?w=500&q=80" },
            { id: 'm7', name: "Tuna Sub", price: 269, category: "Subs", available: true, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80" }
        ]
    },
    {
        id: 104,
        name: "Starbucks",
        owner: "Mike Coffee",
        status: "approved",
        revenue: 12000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
        menu: [
            { id: 'm8', name: "Cappuccino", price: 240, category: "Coffee", available: true, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80" },
            { id: 'm9', name: "Croissant", price: 180, category: "Bakery", available: true, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80" }
        ]
    },
];
