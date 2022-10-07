const fs = require('fs');
const _ = require('lodash');

const { reactorDataOverview } = require('../assets/data-overview');
const { reactorDataCore } = require('../assets/data-core');
const { reactorDataGeneral } = require('../assets/data-general');
const { reactorDataMaterial } = require('../assets/data-material');
const { reactorDataNsss } = require('../assets/data-nsss');
const { reactorDataRcs } = require('../assets/data-rcs');
const { reactorDataRpv } = require('../assets/data-rpv');

async function mergeData() {
  let reactorsList = _(reactorDataOverview)
    .concat(
      reactorDataCore,
      reactorDataGeneral,
      reactorDataMaterial,
      reactorDataNsss,
      reactorDataRcs,
      reactorDataRpv
    )
    .groupBy('name')
    .map(_.spread(_.merge))
    .value();

  // console.log(reactorsList);

  await fs.writeFile(
    './public/assets/data-merged.js',
    `exports.reactorDataMerged = ` + JSON.stringify(reactorsList, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Successfully merged data');
    }
  );

  console.log(`Merge completed. ${reactorsList.length} added`);
}

exports.mergeData = mergeData;
