import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
async function main() {
    const languages = [
        { code: 'lg', name: 'Luganda' },
        { code: 'en', name: 'English' },
        { code: 'sw', name: 'Swahili' },
        { code: 'ach', name: 'Acholi' },
        { code: 'laj', name: 'Lango' },
        { code: 'nyk', name: 'Runyankole' },
        { code: 'ruk', name: 'Rukiga' },
        { code: 'lus', name: 'Lusoga' },
        { code: 'teo', name: 'Ateso' },
        { code: 'lgb', name: 'Lugbara' },
        { code: 'kjo', name: 'Karamojong' },
        { code: 'nyr', name: 'Runyoro' },
        { code: 'tor', name: 'Rutooro' },
        { code: 'alr', name: 'Alur' },
        { code: 'kum', name: 'Kumam' },
        { code: 'mad', name: 'Madi' },
        { code: 'seb', name: 'Sebei' },
        { code: 'ruf', name: 'Rufumbira' },
        { code: 'nkj', name: 'Ngakarimojong' },
        { code: 'sam', name: 'Samia' },
        { code: 'kak', name: 'Kakwa' },
        { code: 'bri', name: 'Bari' },
        { code: 'gis', name: 'Gisu' },
        { code: 'cho', name: 'Chope' },
        { code: 'nap', name: 'Napore' },
        { code: 'dod', name: 'Dodoth' },
        { code: 'thr', name: 'Thur' }
      ];

      for (const language of languages) {
        await prisma.language.upsert({
          where: { code: language.code },
          update: {},
          create: {
            code: language.code,
            name: language.name,
          },
        });
      }
      console.log("Languages seeded successfully");

      // seed genre
      const genres = [
        { name: 'Hiphop', tag: 'music' },
        { name: 'Education', tag: 'music' },
        { name: 'Gospel', tag: 'music' },
        { name: 'Pop', tag: 'music' },
        { name: 'RnB', tag: 'music' },
        { name: 'Trap', tag: 'music' },
        { name: 'Afro pop', tag: 'music' },
        { name: 'Contemporary', tag: 'music' },
        { name: 'EDM (Electronic Dance Music)', tag: 'music' },
        { name: 'Classical', tag: 'music' },
        { name: 'Childrens Music', tag: 'music' },
        { name: 'Comedy', tag: 'music' },
        { name: 'Commercial', tag: 'music' },
        { name: 'Country', tag: 'music' },
        { name: 'Techno', tag: 'music' },
        { name: 'French Pop', tag: 'music' },
        { name: 'Fitness and Workout', tag: 'music' },
        { name: 'Indie Pop', tag: 'music' },
        { name: 'Holiday Music', tag: 'music' },
        { name: 'Instrumental', tag: 'music' },
        { name: 'J-Pop', tag: 'music' },
        { name: 'Jazz', tag: 'music' },
        { name: 'Karaoke', tag: 'music' },
        { name: 'Metal', tag: 'music' },
        { name: 'UG-X Bounce', tag: 'music' },
        { name: 'Reggae', tag: 'music' },
        { name: 'Motion Picture Soundtrack', tag: 'music' },
        { name: 'Accapella', tag: 'music' },
        { name: 'Afro-Beat', tag: 'music' },
        { name: 'Lingala', tag: 'music' },
        { name: 'Okeme or Lukeme', tag: 'music' },
        { name: 'Ikoce', tag: 'music' },
        { name: 'Lakubukubu', tag: 'music' },
        { name: 'Bongo Flavor', tag: 'music' },
        { name: 'Rock', tag: 'music' },
        { name: 'Mix Tapes', tag: 'music' },
        { name: 'Dance Hall', tag: 'music' },
        { name: 'Rap', tag: 'music' },
        { name: 'Amapiano', tag: 'music' },
        { name: 'Afrosounds', tag: 'music' },
        { name: 'Alternative', tag: 'music' }
      ];

      for (const genre of genres){
        await prisma.genre.upsert({
            where: { name: genre.name },
            update: {},
            create: {
              name: genre.name,
            },
        })

      }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })