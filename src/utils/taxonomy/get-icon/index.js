// @flow

export default (lineage /*: string */) => {
  /* Node Pediculidae (body lice, includes 121224 Pediculus humanus subsp. corporis (louse) */
  if (lineage.includes(' 121221 ')) return '4';
  /* Node Apoidea (bees) */
  if (lineage.includes(' 34735 ')) return '$';
  /* Node Scorpiones (Scorpion) */
  if (lineage.includes(' 6855 ')) return 's';
  /* Node Ixodida (Ticks) */
  if (lineage.includes(' 6935 ')) return '&';
  /* Node Gastropoda (Snail) */
  if (lineage.includes(' 6448 ')) return "'";
  /* Node anolis */
  if (lineage.includes(' 28376 ')) return '7';
  /* Node felidae (includes 9685 Felis catus) */
  if (lineage.includes(' 9681 ')) return 'A';
  /* homo */
  if (lineage.includes(' 9606 ')) return 'H';
  /* Mouse-ear cress */
  if (lineage.includes(' 3702 ')) return 'B';
  /* Node Nematoda (includes 6239 Caenorhabditis elegans) */
  if (lineage.includes(' 6231 ')) return 'W';
  /* Gallus gallus (Chicken) */
  if (lineage.includes(' 9031 ')) return 'k';
  /* Node Capra (includes 9925 Capra hircus goat) */
  if (lineage.includes(' 9922 ')) return 'm';
  /* Node Sciuridae (Squirrels) */
  if (lineage.includes(' 55153 ')) return 'I';
  /* Node Platanistidae (Dolphin) */
  if (lineage.includes(' 9723 ')) return 'D';
  /* Node Amphibia */
  if (lineage.includes(' 8292 ')) return 'f';
  /* Node Bird (Finch) */
  if (lineage.includes(' 8782 ')) return 'n';
  /* subNode Culicidae (Mosquito) */
  if (lineage.includes(' 7157 ')) return '1';
  /* Node Diptera (includes 7227 drosophila melanogaster)- WARNING HAS TO BE AFTER Mosquitoe node */
  if (lineage.includes(' 7147 ')) return 'F';
  /* Node Arthropoda (Spider) */
  if (lineage.includes(' 6656 ')) return 'S';
  /* Node Plasmodium (Plasmodiidae) */
  if (lineage.includes(' 1639119 ')) return '@';
  /* Zebrafish */
  if (lineage.includes(' 7955 ')) return 'Z';
  /* Node Tetraodontidae (puffers) (includes 31033 Takifugu rubripes) */
  if (lineage.includes(' 31031 ')) return 'E';
  /* Node Fish (7898 Actinopterygii NOT 7776 Gnathostomata includes mammals -  NOT 7777 Chondrichthyes) */
  if (lineage.includes(' 7898 ')) return 'Z';
  /* Node Mouse (includes 10090 Mus musculus) */
  if (lineage.includes(' 10088 ')) return 'M';
  /* Node Erinaceidae (Hedgehog) */
  if (lineage.includes(' 9368 ')) return 'o';
  /* Node Rattus (includes 10116 Rattus norvegicus) */
  if (lineage.includes(' 10114 ')) return 'R';
  /* Canis lupus familiaris (Dog) */
  if (lineage.includes(' 9615 ')) return 'd';
  /* Node Bovinae (includes Bos taurus (Bovine) 9913) */
  if (lineage.includes(' 27592 ')) return 'C';
  /* Node Proboscidea (elephants) (inludes 9783 Indian Elephant) */
  if (lineage.includes(' 9779 ')) return 'e';
  /* Node Ovis (includes 9940 Sheep) */
  if (lineage.includes(' 9935 ')) return 'x';
  /* Node Leporidae (includes Oryctolagus cuniculus (Rabbit) 9986 */
  if (lineage.includes(' 9979 ')) return 't';
  /*  Suidae (Pig) */
  if (lineage.includes(' 9821 ')) return 'p';
  /* Node Cavia (includes 10141 Cavia porcellus (Guinea pig)) */
  if (lineage.includes(' 10140 ')) return 'g';
  /*  Node Didelphidae (opossums) (icnludes 126299 Monodelphis emiliae (Emilia's short-tailed opossum) */
  if (lineage.includes(' 9265 ')) return '9';
  /* Node Papio (includes 9555 Papio anubis (Olive baboon)) */
  if (lineage.includes(' 9554 ')) return '8';
  /* Node Pan (chimpanzees) (includes 9598 Pan troglodytes) */
  if (lineage.includes(' 9596 ')) return 'i';
  /* Node Macaca (includes 9544 Macaca mulatta (Rhesus macaque) */
  if (lineage.includes(' 9539 ')) return 'r';
  /* Node Chiroptera (bats) (includes 9430 Desmodus rotundus (Vampire bat) */
  if (lineage.includes(' 9397 ')) return '(';
  /* Node Pongo (orangutan) */
  if (lineage.includes(' 9599 ')) return '*';
  /* Node Gorilla */
  if (lineage.includes(' 9592 ')) return 'G';
  /* Saccharomyces cerevisiae (Baker's yeast) or Schizosaccharomycetaceae (fission yeasts) */
  if (lineage.includes(' 4932 ') || lineage.includes('4894')) return 'Y';
  /* Archaea */
  if (lineage.includes(' 2157 ')) return 'L';
  /* Node Bacteria (Ecoli) */
  if (lineage.includes(' 2 ')) return 'L';
  /* Node Virus */
  if (lineage.includes(' 10239 ')) return 'v';
  /* Node Fungus */
  if (lineage.includes(' 4751 ')) return 'u';
  /* Node Oryza (includes 4530 (Oriza sativa)) */
  if (lineage.includes(' 4527 ')) return '6';
  /* Node Zea (Corn) (includes 4577 Zea mays (Maize)) */
  if (lineage.includes(' 4575 ')) return 'c';
  /* Node Lycopersicon (Tomatoes) */
  if (lineage.includes(' 49274 ')) return ')';
  /* Node Hordeum (Barley) */
  if (lineage.includes(' 4512 ')) return '5';
  /* Node Brassicaceae (mustard family) */
  if (lineage.includes(' 3700 ')) return 'B';
  /* Node Vitis (grape) */
  if (lineage.includes(' 3603 ')) return 'O';
  /* Node Soja (includes 3847 Glycine max (Soybean)) */
  if (lineage.includes(' 1462606 ')) return '^';
  /* Node viridiplantae */
  if (lineage.includes(' 33090 ')) return '.';
};
