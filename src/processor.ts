// Imports
import xlsx from 'node-xlsx';
import * as path from 'path';
import * as co from 'co';
import * as fs from 'fs';

// Imports repositories
import { DataRepository } from './repositories/data';

// Imports services
import { PredictorService } from './services/predictor';


// co(function* () {
//     const filename: string = path.join(__dirname, '..', 'documents', 'disliked.xlsx');

//     const workSheetsFromFile = xlsx.parse(filename);

//     const dataRepository: DataRepository = new DataRepository();
//     const predictorService = new PredictorService(dataRepository);

//     for (const row of workSheetsFromFile[0].data) {

//         try {
//             yield predictorService.addDislikedDocument('40335', row[2]);
//         } catch (err) {
//             console.log(err.message)
//         }

//     }

// });

co(function* () {

    const dataRepository: DataRepository = new DataRepository();
    const predictorService = new PredictorService(dataRepository);

    const beerHtml = `<p>Brewers are launching mid-strength extensions of major beer brands. Not only do these appeal to consumers, offering the taste of a full-strength lager but with a lower-alcohol content, but they are also more profitable for brewers which pay less tax on lower-alcohol products.</p>
<div class="jump_break" contenteditable="false" unselectable="on"></div>
<p>Brewers have launched mid-strength variants of the leading beer brands in Belgium (Jupiler Blue), the UK (Carling C2) and Australia (VB Midstrength). Lowering the alcohol content of beer is an astute move on the part of manufacturers. For example, earlier this year the Foster's Group changed the strength of its 'regular strength' Victoria Bitter from 4.9% ABV to 4.8% ABV to cut the amount of excise the company pays on the beer it brews. This move is expected to save the company approximately A$10 million (US$8.57million) a year in excise tax payments without a discernable change in the taste of the beer to consumers. Additionally, these mid-strength beers tend to retail for a higher price per litre than their full-strength counterparts (eg Jupiler Blue is 13% more expensive per litre than Jupiler) making these products even more profitable for brewers. </p>
<p>Mounting concerns over binge drinking and drink driving are expected to result in a higher degree of social responsibility. Manufacturers are jumping on the bandwagon as public health campaigns gain momentum and regulations are tightened to promote responsible alcohol consumption. These beers appeal to consumers looking to lower their alcohol intake while still enjoying the flavour of regular-strength brands as well as consumers who do not typically consume beer. In Cameroon, for example, Castel Groupe's 3.8% ABV Beaufort Light beer (launched in June 2006) captured 0.5% of the total beer market by volume in 2007 without diminishing the share of its regular strength counterpart (4.6% ABV Beaufort). In addition to appealing to men (who are not seen to be drinking a weak, 'unmanly' beer) these lower-alcohol products also appeal to females, a growing consumer group for beer. </p>
<p>The next development in mid-strength beer could come from Guinness. Last year Diageo launched a mid-strength draught Guinness variant (with 2.8% ABV instead of 4.2% ABV) on a trial basis in Limerick designed to appeal to more responsible and health-conscious drinkers.</p>
<p></p>
<h4 class="analysisReportTableWrap">Comparison of selected new product launches </h4>
<table class="analysisReportTableWrap analysisReportTable" border="0" cellspacing="0" cellpadding="0" unselectable="on">
  <tbody>
    <tr class="headerRow">
      <td>
      </td>
      <td class="ReportTableDescCell">Jupiler Blue (InBev)</td>
      <td class="ReportTableDescCell">Carling C2 (Molson Coors Brewing Co)</td>
      <td class="ReportTableDescCell">VB Midstrength Lager (Foster’s Group Ltd)</td>
    </tr>
    <tr class="dataRow"></tr>
    <tr class="dataRow">
      <td>Country</td>
      <td class="ReportTableDescCell">Belgium</td>
      <td class="ReportTableDescCell">United Kingdom</td>
      <td class="ReportTableDescCell">Australia</td>
    </tr>
    <tr class="dataRow">
      <td>Launch date</td>
      <td class="ReportTableDescCell">March 2006</td>
      <td class="ReportTableDescCell">September 2006</td>
      <td class="ReportTableDescCell">May 2007</td>
    </tr>
    <tr class="dataRow">
      <td>Retail price</td>
      <td class="ReportTableDescCell">EUR5.92 for 6 x 500ml cans (EUR1.97 per litre)</td>
      <td class="ReportTableDescCell">£3.49 for 4 x 500ml cans (£1.75 per litre)</td>
      <td class="ReportTableDescCell">A$31 for 24 x 375ml bottles (A$3.44 per litre) </td>
    </tr>
    <tr class="dataRow">
      <td>Retail price of regular strength beer</td>
      <td class="ReportTableDescCell">Jupiler – EUR6.89 for 12 x 330ml cans (EUR1.74 per litre)</td>
      <td class="ReportTableDescCell">Carling – £2.99 for 4 x 500ml cans (£1.50 per litre)</td>
      <td class="ReportTableDescCell">Victoria Bitter – A$46.99 for 30 x 375ml bottles (A$4.18 per litre)</td>
    </tr>
    <tr class="dataRow">
      <td>Alcohol content</td>
      <td class="ReportTableDescCell">3.3% ABV</td>
      <td class="ReportTableDescCell">2% ABV</td>
      <td class="ReportTableDescCell">3.5% ABV</td>
    </tr>
    <tr class="dataRow">
      <td>Marketing</td>
      <td class="ReportTableDescCell">Targeted at younger consumers (20-30-year-olds) who want a beer to accompany a meal but steer clear of ordering a stronger alternative. Available in supermarkets and throughout the on-trade.</td>
      <td class="ReportTableDescCell">Even though this is actually a low-alcohol beer, Carling C2 is marketed as a mid-strength beer with the strength of flavour and body of a ‘proper’ pint of lager but with less alcohol. The company committed £2 million to support the off-trade launch of the 4-pack format, even offering a money back guarantee on the launch packs. </td>
      <td class="ReportTableDescCell">The first VB line extension is marketed as having the taste of a full-strength lager but with a lower-alcohol content. Targets consumers of all ages in Queensland and Western Australia and those aged 30+ outside these two states. Available in both the on-trade and off-trade, the launch was supported by a A$3 million marketing campaign including television and print advertising and outdoor marketing. </td>
    </tr>
  </tbody>
</table>
<h3>Catherine Mars, Industry Analyst – Alcoholic Drinks: catherine.mars@euromonitor.com</h3>`;

    const hotDrinksHtml = `<p>Co-operation is set to increase product variety and improve sophistication of the industry.</p>
<div class="jump_break" contenteditable="false" unselectable="on"></div>
<p>The strong growth of the Russian hot drinks market has attracted keen interest from both major domestic manufacturers and multinationals which are increasingly working together in order to gain market share. Orimi has entered into partnerships with both Greenfield Tea and Jardin Café Solution to enter the premium tea and fresh coffee categories and has achieved a certain degree of success.</p>
<h2>Orimi and Greenfield in premium tea </h2>
<p>Orimi is a Russian-based tea vendor which leads its domestic market with a value share of 13%. The company generated a retail value of US$680 million globally in 2007, thanks to its strength in black standard tea, which accounts for over 70% of its total sales. Over the past seven years, its flagship black standard tea brand Princess Gita not only maintained its lead in the category but also made considerable share gains of five percentage points in the country. Globally, Orimi is a rising star in black speciality tea (key brands Princess Kandi and Princess Noori) in which it managed to grow its share from 3% in 2000 to 5% in 2007. This shows the competitiveness of Orimi amid the increased activities of international players. Like other active players (such as Ahmad Tea London Ltd), Orimi certainly benefits from the rising number of middle-class consumers who have provided an expanding consumer base for premium teas.</p>
<p>In recent years, Orimi has partnered Greenfield Tea Ltd and produced premium tea brands Greenfield and Tess which are supported by massive advertising campaigns. The two brands target female consumers in their mid-20s to early-30s who are health conscious and willing to pay a premium for quality tea. Greenfield's expertise in managing speciality tea brands and Orimi's production facilities and distribution network seem to work well together. Greenfield has become one of the fastest growing major brands in the overall tea market over the past couple of years. It should be noted that although Greenfield Tea Ltd remains the ultimate owner of the two new brands, Orimi has improved its revenue streams through contract manufacturing which allow it to use its growing financial muscle to expand its overall hot drinks business.</p>
<p>In 2007 Orimi established a partnership with Jardin Café Solution SA and introduced speciality and gourmet fresh coffee brand Jardin, which places an emphasis on the country of origin of the coffee beans used. Its premium gourmet ranges such as Continental, Dessert Cup and Espresso Stile di Milano are likely to perform well as fresh coffee is predicted to post a strong value CAGR of 12% over 2007-2012.</p>
<h3>Arrival of international partners</h3>
<p>Attracted by the large population and the high-growth economy, international players such as Newby Teas of London are showing a growing interest in exploring the Russian market. At the same time, local Russian majors are constantly looking for international partners to jointly grow their hot drinks businesses. It is worth mentioning that this phenomenon is not commonly seen in other FMCG industries. This is perhaps due to the fact that the hot drinks industry needs to import raw materials such as semi-produced tea or coffee for production and these international players may be able to offer adequate supply. The Russians and their foreign counterparts either set up joint ventures or reach business agreements to jointly grow a specific category or brand. Traditionally, their products mainly target CIS countries and their neighbours. However, mega players such as Kraft seem to adopt a different penetration strategy and have the financial strength to develop their wholly-owned businesses organically in the country.</p>
<p>Mai Kompanya OAO (ranked fourth in tea in Russia) has a long-term partnership with Tata Tea and World Coffee Company SA. Since 2007, Mai has worked with Curtis & Patridge London Ltd to produce the tea brand Curtis. In other hot drinks categories, Grand CD OOO and the German company Kruger AG have set up joint venture Kruger Grand ZAO to manufacture instant tea and chocolate-based powder drinks.</p>
<p>Euromonitor International believes that the business deals between Russian manufacturers and international players will continue to rise in the short to medium term. Through such collaboration they may form a strong force in the long term in the CIS region to compete against multinationals such as Nestlé, Unilever and Kraft. Multinationals may need, therefore, to speed up their penetration in the region rather than risk missing out.</p>
<h4>Hope Lee, Non-Alcoholic Drinks Company Analyst, hope.lee@euromonitor.com </h4>`;

    const result: boolean = yield predictorService.moreLikelyToBeLiked('40335', predictorService.toWords(hotDrinksHtml));

    console.log(result? 'liked' : 'disliked');
});