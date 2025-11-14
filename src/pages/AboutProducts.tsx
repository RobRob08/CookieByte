// src/pages/CompanyHistory.tsx
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';

// src/pages/AboutProducts.tsx
// src/pages/AboutProducts.tsx
export const AboutProducts: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main" />
          </IonButtons>
          <IonTitle>About Our Products</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Our Cookie Philosophy</h2>
            <p>
              Every cookie we bake is a labor of love. We use only the finest ingredients, including:
            </p>
            <ul>
              <li>Premium Belgian chocolate</li>
              <li>Organic butter and eggs</li>
              <li>Locally sourced vanilla</li>
              <li>Non-GMO flour</li>
            </ul>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🍪 Vanilla-Based Cookies</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h3>Classic Milk Chocolate Chip Cookie</h3>
            <p>Thick, soft, and packed with milk chocolate chips.</p>
            
            <h3>Semi-Sweet Chocolate Chunk Cookie</h3>
            <p>Chocolate chip, but make it chunky—a delicious cookie filled with irresistible semi-sweet chocolate chunks and a sprinkle of flaky sea salt.</p>
            
            <h3>Cookie Dough Cookie</h3>
            <p>A vanilla cookie base loaded with chunks of edible cookie dough and mini chocolate chips for that nostalgic, straight-from-the-bowl taste.</p>
            
            <h3>Vanilla Crumb Cookie</h3>
            <p>A buttery vanilla cookie topped with a swirl of vanilla frosting and golden crumb topping, reminiscent of a classic crumb cake.</p>
            
            <h3>Snickerdoodle Cookie</h3>
            <p>A classic vanilla sugar cookie rolled in a sparkly cinnamon sugar coating.</p>
            
            <h3>Confetti Milkshake Cookie</h3>
            <p>A festive vanilla cookie topped with whipped milkshake frosting, rainbow sprinkles, and a swirl of cream.</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🍫 Chocolate-Based Cookies</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h3>Molten Lava Cookie</h3>
            <p>A rich chocolate cookie with a soft, gooey center and a dusting of powdered sugar.</p>
            
            <h3>Choco Mallows Cookie</h3>
            <p>A fudgy chocolate cookie topped with mini marshmallows and a swirl of chocolate cream.</p>
            
            <h3>Dirt Cake Cookie</h3>
            <p>A playful chocolate cookie layered with silky chocolate frosting, crushed Oreos, and a gummy worm on top, mimicking dirty soil.</p>
            
            <h3>Choco Milkshake Cookie</h3>
            <p>A creamy chocolate cookie topped with malted milk frosting and a dollop of whipped cream.</p>
            
            <h3>Oreo Birthday Cake Cookie</h3>
            <p>A chocolate cookie topped with vanilla frosting, rainbow sprinkles, and crushed Oreo pieces.</p>
            
            <h3>Chocolate Tart Cookie</h3>
            <p>A decadent chocolate cookie topped with swirls of white and dark chocolate cream, finished with mini chocolate chunks.</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🍊 Citrus and Fruity Cookies</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h3>Fruity Cereal Cookie</h3>
            <p>A vanilla cookie topped with crunchy, colorful, fruity cereal and a drizzle of cereal milk glaze.</p>
            
            <h3>Strawberry Cake Cookie</h3>
            <p>A warm strawberry and vanilla cookie swirled with a fresh strawberry cream cheese frosting and sprinkled with delicate white chocolate curls.</p>
            
            <h3>Key Lime Cookie</h3>
            <p>A zesty lime cookie topped with whipped cream and a fresh lime wedge.</p>
            
            <h3>Strawberry Pretzel Cookie</h3>
            <p>A sweet strawberry cookie layered with strawberry glaze, crushed pretzels, and a drizzle of white icing.</p>
            
            <h3>Caramel Apple Cookie</h3>
            <p>A warm cinnamon apple cookie topped with caramel cream cheese frosting, chopped green apples, a drizzle of caramel, and a house-made streusel.</p>
            
            <h3>Raspberry Butter Cake Cookie</h3>
            <p>A buttery vanilla cookie topped with raspberry sauce and a dollop of whipped cream.</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🥜 Nutty Cookies</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h3>Peanut Butter Choco Chip Cookie</h3>
            <p>A chewy peanut butter cookie loaded with milk chocolate and peanut butter chips.</p>
            
            <h3>Hazelnut Sea Salt Cookie</h3>
            <p>A chocolate hazelnut cookie with a sprinkle of sea salt on top.</p>
            
            <h3>Macadamia Nut Cookie</h3>
            <p>A buttery vanilla cookie filled with creamy white chocolate chips and crunchy macadamia nuts.</p>
            
            <h3>Pecan Cream Cookie</h3>
            <p>A soft brown sugar cookie topped with whipped cream cheese frosting and toasted pecans.</p>
            
            <h3>Chocolate Peanut Butter Cookie</h3>
            <p>A rich chocolate cookie stuffed with smooth peanut butter and finished with a swirl of peanut butter on top.</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>✨ Specialty Cookies</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h3>DUBAI CHOCO</h3>
            <p>A decadent chocolate cheesecake nestled on a chocolate graham crust, topped with crispy Kataifi and pistachio filling, a drizzle of pistachio cream, and a dollop of whipped cream.</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🎃 Limited Edition Cookies</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h3>SMORES</h3>
            <p>A graham cracker cookie packed with milk chocolate chips then topped with a melty marshmallow, chocolate drizzle, and buttery graham cracker crumbs.</p>
            
            <h3>Caramel Pumpkin Cookie</h3>
            <p>A spiced pumpkin cookie topped with rich caramel drizzle and a hint of cinnamon.</p>
            
            <h3>Halloween Cookie</h3>
            <p>A festive vanilla cookie topped with whipped milkshake frosting, halloween-colored sprinkles, and a swirl of cream.</p>
            
            <h3>Pumpkin Cheesecake Cookie</h3>
            <p>A pumpkin spice cookie topped with tangy cheesecake frosting and a buttery graham crumb.</p>
            
            <h3>Pumpkin Pie Cookie</h3>
            <p>A soft pumpkin cookie filled with pumpkin pie filling and topped with pumpkin-flavored whipped cream, a dusting of nutmeg, and a dollop of whipped cream.</p>
            
            <h3>Caramel Twix Cookie</h3>
            <p>A vanilla cookie layered with gooey caramel, chocolate frosting, and chopped Twix pieces.</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h3>Quality Guarantee</h3>
            <p>
              All our cookies are baked fresh daily. We guarantee quality and freshness or your money back!
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default AboutProducts;