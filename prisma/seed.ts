import { db } from "~/utils/db.server"

async function seed() {
    const user = await db.user.create({
        data: {
        fullName: "Kody Bradley",
        email: "kody@gmail.com",
          username: "kody",
          // this is a hashed version of "twixrox"
          passwordHash:
            "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
        },
      });

      const lot = await db.lot.create({
        data: {
        title: "Watches",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Architecture",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Cars",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Movie Trailers",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Airbnbs",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Fashion",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Books",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Home Goods",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Articles- General Interest",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Gadgets",
        description: "cool hardware products",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Web Inspo",
        description: "beautifully designed sites",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Visual Artist",
        description: "artist (painters, photographers, ect. that I'm feeling",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "DJ Sets",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Jams",
        description: "hot tracks",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "SETS- Audio/Visual",
        description: "videos of dj sets",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "MISC",
        description: "public school is so random",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Web Dev Resources",
        description: "learning web dev- articles, tutorials, etc.",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      

      await db.lot.create({
        data: {
        title: "Dev / Design Sites",
        description: "adjsfklasjd fk;las jdfkla sddfklj jewrljkeklrj skldfj asdklfkajsd ffj really long description personal websites of devs and designers that I'm feeling",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Cool Startups",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Photo Books",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Maps",
        description: "pinnned places in google maps for different cities",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Hotels",
        description: "hotels I'd like to spend the night at",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Recipees",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });
      await db.lot.create({
        data: {
        title: "Fonts",
        authorId: user.id,
        featured: true,
        users: {
          connect: {
            id: user.id
          }
        }
        },
      });

      const post = await db.post.create({
        data: {
        title: "Brew Watch",
        description: "awesome new watch from brew",
        authorId: user.id,
        url: "https://www.brew-watches.com/watches/brew-metric-retro-black",
        imageUrl: "https://images.squarespace-cdn.com/content/v1/53e92ce7e4b04af975febb0e/1626911419880-0LLVZC3YHI7L3F9Q6W9U/BLACK+DIAL-A_SD.jpg?format=2500w",
        lotId: lot.id,
        },
      });

      const postTwo = await db.post.create({
        data: {
        title: "Autodromo",
        description: "Group B Aqua",
        authorId: user.id,
        imageUrl: "https://hodinkee.imgix.net/shop/images/decf6d60-3e11-497c-8070-0928871b2171/Aqua_front.jpg?auto=format&ixlib=react-9.3.0&w=1446",
        url: "https://shop.hodinkee.com/products/autodromo-group-b-aqua",
        lotId: lot.id
        },
      });


//   await Promise.all(
//     getJokes().map((joke) => {
//       return db.user.create({ data: joke });
//     })
//   );
}

seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}