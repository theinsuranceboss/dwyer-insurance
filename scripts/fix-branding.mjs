import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function fix() {
  const settingUpdates = [
    ['heroSubtitle', 'Dwyer Insurance Group'],
    ['siteName', 'Dwyer Insurance Group'],
    ['footerText', 'Your protection is our priority — Dwyer Insurance Group'],
    ['footerCopyright', 'Dwyer Insurance Group. All Rights Reserved.'],
    ['heroTitle', 'Suzanne Dwyer'],
    ['siteDescription', 'Home, Life and Car Insurance from Dwyer Insurance Group in Wynnewood, PA'],
  ];
  for (const [key, value] of settingUpdates) {
    await db.siteSetting.update({ where: { key }, data: { value } });
    console.log('updated setting:', key);
  }
  await db.agentInfo.update({ where: { key: 'title' }, data: { value: 'Licensed Insurance Agent' } });
  console.log('updated agent title');
  
  // Update page sections to remove "Allstate" references
  await db.pageSection.updateMany({
    where: { section: 'about' },
    data: {
      title: 'Your Trusted Insurance Partner in Wynnewood',
      subtitle: 'About Suzanne',
      description: 'As an Elite Agent at Dwyer Insurance Group serving the Wynnewood community, Suzanne Dwyer brings dedication, expertise, and a personal touch to every client relationship. She understands that insurance isn\'t just about policies — it\'s about protecting the people and things that matter most to you.\n\nWhether you\'re purchasing your first home, starting a business, or looking to protect your family\'s future, Suzanne takes the time to understand your unique situation and find the right coverage at the right price.',
    }
  });
  console.log('updated about section');
  
  console.log('All done!');
}

fix().catch(console.error).finally(() => db.$disconnect());
