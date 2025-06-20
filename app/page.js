"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head'; // Import Head for viewport meta tag

// --- Configuration ---
const NAM_DECIMAL_PLACES = 6;
const NAM_DENOM_FACTOR = 10 ** NAM_DECIMAL_PLACES;
const INDEXER_BASE_URL = 'https://indexer.namada.tududes.com/api/v1/account/';

// Helper function to parse allocation values from string (handling thousands separators and decimal comma)
function parseAllocation(value) {
    if (typeof value !== 'string') return NaN;
    // Remove thousand separators (dots) and replace decimal comma with dot
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}

// JSON data replacing the rawDataString and parseData function
// TPKNAM addresses and correctly parsed initialAllocation values are included.
const initialData = [
    { name: 'Daniel (Mandragora)', tpknamAddress: 'tpknam1qpm6dnvjdznrqf54u20sr7wr27fysdanhukn9rjk6q4utj3n55x8vs5f99a', tnamAddress: 'tnam1qrmanuyyunsljx3jek6wzq3th2v4p6k2nvqsq9yu', initialAllocation: parseAllocation('1.079.930,75'), currentBalance: 'Loading...' },
    { name: 'sirouk', tpknamAddress: 'tpknam1qzfj8yk4eqmwy9fewfq4p9kcfcrl5yzgkqve0duqxee6ys8zcw7pcpcwaqk', tnamAddress: 'tnam1qq0t2s4dmqvxqwl25fm3eyckgekgftggfg9nfe5h', initialAllocation: parseAllocation('356.490,16'), currentBalance: 'Loading...' },
    { name: '0xGolden', tpknamAddress: 'tpknam1qruckhfkjt9f2hp05ch6ud86jsqdq33qchrxm7wxrjjt054t8p83gl9g5pf', tnamAddress: 'tnam1qqxrtxz2n6ek5thd9qdxhztrl58swrkkp55y7gyv', initialAllocation: parseAllocation('289.400,28'), currentBalance: 'Loading...' },
    { name: 'veight', tpknamAddress: 'tpknam1qzvezptsfw777mww3fa5fdam4ertlygtcfl9r2xww2pkp466kfww777wx76', tnamAddress: 'tnam1qrmt5f8qy8dkjattjdlsnfez8c3hnr6zev600stx', initialAllocation: parseAllocation('264.271,63'), currentBalance: 'Loading...' },
    { name: '!encipher', tpknamAddress: 'tpknam1qr69mxvatnk8zpk7028vhzw9h74v27nt0ykc44cxmj7mukxcpwhh643rljd', tnamAddress: 'tnam1qq58qdqn9ragnq9zk9cz8pz5spkrx3hf3yshu72k', initialAllocation: parseAllocation('234.333,67'), currentBalance: 'Loading...' },
    { name: 'ke1pie', tpknamAddress: 'tpknam1qq34egp8r2ww4qsy798vxc2qr6x5559qwhsljdspazpudlnytccc6zz3pew', tnamAddress: 'tnam1qp73a52vzpy279y3vj7wny0yukkmwaydhs4huulj', initialAllocation: parseAllocation('221.949,69'), currentBalance: 'Loading...' },
    { name: 'CryptoDruide | Crypto_Universe', tpknamAddress: 'tpknam1qppp6kywggvlrm3500z3n276f6t56zvjd5slulpv45dd5ap9hkh5jf69kdj', tnamAddress: 'tnam1qp4n652cywawhw95nys7q99kmzzxl677svayxtc6', initialAllocation: parseAllocation('217.861,78'), currentBalance: 'Loading...' },
    { name: 'RuslanGL', tpknamAddress: 'tpknam1qzyty6vx3kttgr09ca8p5nzrhhdhgjm9ffyxhp9sjvvl6ks7g92nzpgj0e3', tnamAddress: 'tnam1qp03tgvuhy9glsq7tjwtxd9tddq2ef8qsgt6gepw', initialAllocation: parseAllocation('171.451,93'), currentBalance: 'Loading...' },
    { name: 'Cryptopital', tpknamAddress: 'tpknam1qrqrq00fttyhkx9r9zaldtmzyt7gth2z2ym9ulkx0xh770fq560juganw7u', tnamAddress: 'tnam1qq4axm5ptj36tqy27e6qgc5tcfc5nx7lu5xgajap', initialAllocation: parseAllocation('165.199,83'), currentBalance: 'Loading...' },
    { name: 'cryptobtcbuyer', tpknamAddress: 'tpknam1qqh9gu556m47vny2h58gfr0zardjl68j57dy4caw6mr9nkvgjes0uuwgz9m', tnamAddress: 'tnam1qzpgcq8ymkxvq9j4jn6vcm64uf7znsywk55zwfvz', initialAllocation: parseAllocation('161.111,91'), currentBalance: 'Loading...' },
    { name: 'ixela', tpknamAddress: 'tpknam1qq2q7e04e0fd44wyqde4382n8tpe5cgsvy3nwr39akuklhrakta2c2f6rxx', tnamAddress: 'tnam1qz0cz4c8smd7lsjxk86u32sfv8xdh3ehtcerm25q', initialAllocation: parseAllocation('153.657,48'), currentBalance: 'Loading...' },
    { name: 'anastese', tpknamAddress: 'tpknam1qqa84tpdvxswkffyk497dcxhgyzmq5jgk6cnp0w3mrqjk2jz9qqz6gcqpz7', tnamAddress: 'tnam1qpmt9f2caw8qnfr2zrwr229z3c76wcl32ynyzhd4', initialAllocation: parseAllocation('151.853,99'), currentBalance: 'Loading...' },
    { name: 'viboracecata', tpknamAddress: 'tpknam1qzyh9jt3edn04rha3d68yc0c2zzcjgppa5gx5l78rmf626eqypvxz7trv69', tnamAddress: 'tnam1qrzq7qz6u9clvkg2qp90slglemy96eqfyg4mhx4k', initialAllocation: parseAllocation('149.569,57'), currentBalance: 'Loading...' },
    { name: 'Nodes.Guru', tpknamAddress: 'tpknam1qzj5t5x27wlteeegahcz939q9dlj69tvztp779aqaycdyaqzuxakytpapdk', tnamAddress: 'tnam1qr36j29ujmynjjj63c8269cghz60xtkxrct92tv7', initialAllocation: parseAllocation('138.628,38'), currentBalance: 'Loading...' },
    { name: 'CryptoSJnet', tpknamAddress: 'tpknam1qpeh2v6cg8t7hre03xpjfc8q5uxfcm0fud2z976a4hpf08t85dnr5a4jwfc', tnamAddress: 'tnam1qpj9aye7zd86pgfpjh2pnal3yjzrfkff2s6n5fq4', initialAllocation: parseAllocation('130.933,49'), currentBalance: 'Loading...' },
    { name: 'fego', tpknamAddress: 'tpknam1qpueq6jksdvewclvkanqzedkpz45xh4gefdv7wzhufj7uk59hnrlzp7gd0c', tnamAddress: 'tnam1qpuqgcvesxhcyhh72vctdql3r6xqkdaxgqv5v3k9', initialAllocation: parseAllocation('119.992,31'), currentBalance: 'Loading...' },
    { name: 'amadison79', tpknamAddress: 'tpknam1qzg0zgmpsp8nh9lpjgtf6udtxkaepcjhqxc8k5pynlpqqj0aafww6mm50ac', tnamAddress: 'tnam1qr3x6geajq4ghxctzsn02jaw8elu6m5005w2ve37', initialAllocation: parseAllocation('107.367,86'), currentBalance: 'Loading...' },
    { name: 'Anastalita', tpknamAddress: 'tpknam1qqr79fa25xg7sskj2wu05pxqra5k9p8ux29txnahsfm2c6x2twq42nvgu0x', tnamAddress: 'tnam1qpa6e6cg6fpgtxd03f58m9v7yr27kjjw5vj3m36j', initialAllocation: parseAllocation('105.804,84'), currentBalance: 'Loading...' },
    { name: 'gnosed', tpknamAddress: 'tpknam1qz3gduzakd6keznq9ju3ftllmx6lmy636xdrypf6tvf5rle7c4nhwxgxv53', tnamAddress: 'tnam1qq3ad0g88vzs7hwh3zkrxmah3jczt8uf5cazfslv', initialAllocation: parseAllocation('105.804,84'), currentBalance: 'Loading...' },
    { name: 'MADMAN', tpknamAddress: 'tpknam1qrrtz3w3jn6t77zpfhd9cchd0cf09cqj2pana4rdkdqv0e3664lhxvv5e4g', tnamAddress: 'tnam1qrm70x8ll8v0ccqthwdwvjctkhf9xaumzqu4uxhs', initialAllocation: parseAllocation('102.919,25'), currentBalance: 'Loading...' },
    { name: 'Minajuddin', tpknamAddress: 'tpknam1qpc3j7tcdadx4j6ad5vm4esqgm8qqkcv0qjgxf3yj09vxa0hh62mq9n7vs0', tnamAddress: 'tnam1qznqfllstks3hc6d5wp50cnwds57s4wey5l804av', initialAllocation: parseAllocation('102.197,86'), currentBalance: 'Loading...' },
    { name: 'SATMan - 0xgen', tpknamAddress: 'tpknam1qqnx74y72jt80yjgljac5d0432ppjk6675f7r8mg0lwe532avxcl65k3e9j', tnamAddress: 'tnam1qz2r7354v4u6qpsk4r9xtuuw8q7e0537yyw3n7sm', initialAllocation: parseAllocation('100.033,67'), currentBalance: 'Loading...' },
    { name: 'lofingvv', tpknamAddress: 'tpknam1qp5l7vph0ln7dhmvkdp57yarcvfh4cykwj4ypmmuajxmyvjzetnfz3k0ew2', tnamAddress: 'tnam1qp937naye9wykm62s5suvczp27efekl50vqhpega', initialAllocation: parseAllocation('97.148,08'), currentBalance: 'Loading...' },
    { name: '2pilot', tpknamAddress: 'tpknam1qzvuj0qpzh7f8ddndw2z082rdah3anzefq7yu7xvxmnuch54745tk0qqj69', tnamAddress: 'tnam1qzfza0lphfanmruw29ddr986nqpen47xpq5dcqsm', initialAllocation: parseAllocation('95.464,82'), currentBalance: 'Loading...' },
    { name: 'AK3 I Crouton Digital', tpknamAddress: 'tpknam1qrwl7rmkrpy9ghfee234fu46u2wl4xk97ypgph75jmn6ku25kknw6mtj7cu', tnamAddress: 'tnam1qpestjcsad9auyn76z76hj95yrk9ypgfh54tkl8n', initialAllocation: parseAllocation('94.983,89'), currentBalance: 'Loading...' },
    { name: 'jasondavies', tpknamAddress: 'tpknam1qp9kjamxt3fjcc63mf7zzc760kp8kgdkfxnya85m5ytp27nq3crwcy3cqpd', tnamAddress: 'tnam1qzhqswwk00qkuw3lnvwhyczd5tksecln5gqe7f5x', initialAllocation: parseAllocation('90.535,28'), currentBalance: 'Loading...' },
    { name: 'SY.Lai | Staking-power', tpknamAddress: 'tpknam1qr2tgsu79r5a3xhdjv3mzwzq8u7mtx68sge8cjxnuamp029lm9hdu9aus6k', tnamAddress: 'tnam1qr0aa9m77lragese03wzcpu6ucdhfg2m55c9r29x', initialAllocation: parseAllocation('85.004,57'), currentBalance: 'Loading...' },
    { name: 'Max Power 🔋', tpknamAddress: 'tpknam1qqhh6488rj0cmdpvm64swqtxn52sds987l6a2esn8wg3quyy0q94clcmsst', tnamAddress: 'tnam1qqaj3tn696chpel8mhc5sxzm0z7vcajx3g42258n', initialAllocation: parseAllocation('80.435,72'), currentBalance: 'Loading...' },
    { name: 'ubongj', tpknamAddress: 'tpknam1qrp4t4grp9jaxt4wg5p4qaaq800wswr4suzr0n23066t4j3j43aygtcw87n', tnamAddress: 'tnam1qqervkqf9t9z2ys89vjqq3057se5je4fjsdf307j', initialAllocation: parseAllocation('78.512,00'), currentBalance: 'Loading...' },
    { name: 'rAdius', tpknamAddress: 'tpknam1qqjdwrxl6wxq44w2dhs3fsyrj49ukzuuwgat320mx5h85nhl67rrquetrvh', tnamAddress: 'tnam1qzt3lx80a5g0wc9c2kqkundm4qdt5v6ukygf5y02', initialAllocation: parseAllocation('77.550,14'), currentBalance: 'Loading...' },
    { name: 'SeptimA [NODER]TEAM', tpknamAddress: 'tpknam1qqsya2phyy20ylusfv2n8prfpgkl9z8snmrp8500msnd5zphg4q9jgsdxfd', tnamAddress: 'tnam1qzp2yw3nvww7l6ffdjw7sz0fzw604cv6q5e86z8t', initialAllocation: parseAllocation('77.429,90'), currentBalance: 'Loading...' },
    { name: 'Maragung', tpknamAddress: 'tpknam1qqd6etx6yvvcmuuwa5x2hjhdtzgk39v28pyf7s9c3hd6qzegfzhw79jaaz3', tnamAddress: 'tnam1qq6jps6lncl0myfqh83t36u8vaal3qyvpggp3s36', initialAllocation: parseAllocation('76.468,04'), currentBalance: 'Loading...' },
    { name: 'newera3', tpknamAddress: 'tpknam1qrptu54drs4qtgzxgeseg80629c3memukaf3r0qfs4vjexuu4m5wyfvakt2', tnamAddress: 'tnam1qr07dspzjm4d8elajwy7q9n46zmhwg2twq7gkxhx', initialAllocation: parseAllocation('75.145,48'), currentBalance: 'Loading...' },
    { name: 'Ben West', tpknamAddress: 'tpknam1qqprlszddgndaldekat838r4vrhpf2lrg0c3crj6hf7rp5sgedgtxmxw9s4', tnamAddress: 'tnam1qqyrnatjva7fnm2djvxtmkz6qxavwz00syfl3v3n', initialAllocation: parseAllocation('73.943,15'), currentBalance: 'Loading...' },
    { name: 'itrocket_net', tpknamAddress: 'tpknam1qpmcqt49yc5phndaud5arxxfhql2trckrjchzjqu73mxzxm6rsgsqnjws4k', tnamAddress: 'tnam1qphapum364zlzj0k0kr7fjma06gryy7zvq9pm3l5', initialAllocation: parseAllocation('73.702,69'), currentBalance: 'Loading...' },
    { name: 'tgogayi', tpknamAddress: 'tpknam1qzn7a90sfehckv523lz0yt7z0z3j7yem3aka9vkjrf03kn3yexfgjuztyqz', tnamAddress: 'tnam1qq0ph5svjjspkaz2ntw49j2zq8855237qcfuupjt', initialAllocation: parseAllocation('71.658,73'), currentBalance: 'Loading...' },
    { name: '!mpp4tunru CaptainClogs', tpknamAddress: 'tpknam1qpdq2qe5jym208w92sfktslk36jtg7rzj6ka7qhehe5helq8lewwc4du3he', tnamAddress: 'tnam1qqr88h7x4tu7q24378x5ajzv8lcyxdn975e90qwq', initialAllocation: parseAllocation('71.057,57'), currentBalance: 'Loading...' },
    { name: 'Amirr', tpknamAddress: 'tpknam1qpncrzvzzmp86gc4p7mca739zn8fykgfpdwxxmx2qrp7e2fty6cx2xsc4gd', tnamAddress: 'tnam1qqd0635gwywt2zhteruk9t58yaltajulusw0kav4', initialAllocation: parseAllocation('69.133,84'), currentBalance: 'Loading...' },
    { name: 'Hoan Wu', tpknamAddress: 'tpknam1qqcv90c92gqm4eczvmrg48l7hqvdsf4943dl5pzlwddv56rpash3c5rv7lc', tnamAddress: 'tnam1qzxns80af9xg76nemfauevvm9sjjeq4quykcrhts', initialAllocation: parseAllocation('65.045,93'), currentBalance: 'Loading...' },
    { name: 'tree888(biwin.bnb)', tpknamAddress: 'tpknam1qrt6mxczl94lt2f5f3wjcmktvfw5zteu4ka4pqwwnz54ytu639kexcxmv32', tnamAddress: 'tnam1qr3cgrzj8d2gzmqx93lty32qqc5ltxdnauxps34y', initialAllocation: parseAllocation('61.919,88'), currentBalance: 'Loading...' },
    { name: 'AnnaB', tpknamAddress: 'tpknam1qput27v2vc26p0x594ew2yay09ruclzs3wg4wkzdvcdv00jlugv5jnyuev4', tnamAddress: 'tnam1qr86f7lkvdgne3amgw4apl7q68k99ppwag80gvy8', initialAllocation: parseAllocation('61.559,18'), currentBalance: 'Loading...' },
    { name: 'CrazyMoney', tpknamAddress: 'tpknam1qps6pupzsr6muz6yzcfgnzfx0jrez0aqx8k7adenzgk9grycnqkn6s9tp09', tnamAddress: 'tnam1qzhldhypqm52jg7qdygry4af07zs4y3vxymcqvmw', initialAllocation: parseAllocation('61.078,25'), currentBalance: 'Loading...' },
    { name: 'Duy Chu', tpknamAddress: 'tpknam1qzkvkc8l5qydlcakjw9p48vy5svh5jxwzpxdzgprr0jg46y4pwqn69nlk4n', tnamAddress: 'tnam1qqad3hwnp2uurajq2pxmqfz4l5qumnau8sr6e0x2', initialAllocation: parseAllocation('58.914,06'), currentBalance: 'Loading...' },
    { name: 'Boruto__', tpknamAddress: 'tpknam1qzmp0uz84z23n47dch6ee443v2kykpq6llj3f96vhtqrrntc3j3exzk0cxg', tnamAddress: 'tnam1qzdxkns9pucyh2sdmkxwpq5mahdh2yldvvvmkv3p', initialAllocation: parseAllocation('58.673,59'), currentBalance: 'Loading...' },
    { name: 'dismad', tpknamAddress: 'tpknam1qp4s4dvh30qud9dax6f4gjxurn046u5mxac6gdxkxy4fz6esqdsvy4s42au', tnamAddress: 'tnam1qp9vzawjxd2h82exxyysyv63h5wgs5h6lsuqe4pw', initialAllocation: parseAllocation('58.433,13'), currentBalance: 'Loading...' },
    { name: 'anrd04', tpknamAddress: 'tpknam1qzjcke2rj40hp2d7gyrfupdjaytfrswuc5vmypcyxc5x0a3nzz5rujf236f', tnamAddress: 'tnam1qrlda6zaglrex3vz0llxh5rngk986mnwnqxtgjaj', initialAllocation: parseAllocation('58.192,66'), currentBalance: 'Loading...' },
    { name: 'shedy', tpknamAddress: 'tpknam1qrg8ygv9grgmtq3psvw2lz2frdn93nylw3gnn4gjvxd3qkxf5ljqzux7pcf', tnamAddress: 'tnam1qqdchcj2l8v3ezcxa8c28sxwutfxnj04kqek62sr', initialAllocation: parseAllocation('58.192,66'), currentBalance: 'Loading...' },
    { name: 'Pathrock', tpknamAddress: 'tpknam1qr43qhec47s6y40vqsckk3knrfqcttshwxz00rf8dg8z85w2d3qjkwqmdtr', tnamAddress: 'tnam1qpuqtudug2taurlljvhkwaqkunlv9rw0qqdrgw64', initialAllocation: parseAllocation('57.471,26'), currentBalance: 'Loading...' },
    { name: 'OriginStake', tpknamAddress: 'tpknam1qzler7ux30dmv6p0shrs6eutfmc2yr30uvceqtwjwf7h9wtgaycw62vez6x', tnamAddress: 'tnam1qrjq5exq7ejw5p3yecjxuteru966xn2hq5huxr3r', initialAllocation: parseAllocation('56.870,10'), currentBalance: 'Loading...' },
    { name: 'Sourled', tpknamAddress: 'tpknam1qqknmcdl43894a65ugze7a36pf8kffyx0kuscsc4gtyh6k9j0v58qfg68pn', tnamAddress: 'tnam1qpu4z9jhd79sz2a2qcwu88s59046hww0eg0l49g7', initialAllocation: parseAllocation('56.389,17'), currentBalance: 'Loading...' },
    { name: 'Tecnodes', tpknamAddress: 'tpknam1qrlkgfd6zmzucgejccqxzusvcapu6u27c47zsap0hyvky3r4gadyzg8nyxt', tnamAddress: 'tnam1qprq7uel08mkd2ec8q4yqsekdugf0qjhxskauggw', initialAllocation: parseAllocation('56.268,94'), currentBalance: 'Loading...' },
    { name: '.Alex', tpknamAddress: 'tpknam1qrezdnvd4ynt99hwngkd2zuwmstgepwte6m287pzkguywurk4nu4z3fyvdk', tnamAddress: 'tnam1qrnk87h0kwx6445k3yu3qj490sfvljfxn5ecmhve', initialAllocation: parseAllocation('56.028,47'), currentBalance: 'Loading...' },
    { name: 'Thuseven', tpknamAddress: 'tpknam1qr6y3t4nkanqlm0guc9gs0t3024m567hqmp5ff7fn9ry34ey6z5hjnn3txx', tnamAddress: 'tnam1qpzzvw8z57suuupn6px7ad4a78lr99r3gyvmfa6r', initialAllocation: parseAllocation('55.667,77'), currentBalance: 'Loading...' },
    { name: 'Kamizake | Namada', tpknamAddress: 'tpknam1qz57q038ft8rm5suvmldq8cpxrsqnp2lkqq9d0fyky6m0dylfnhjq5506nx', tnamAddress: 'tnam1qpz29wx2adkdqulx237mcm6p6vzmyx7htudnxs74', initialAllocation: parseAllocation('55.066,61'), currentBalance: 'Loading...' },
    { name: '. Logosdibta', tpknamAddress: 'tpknam1qp4a8h9v8jn57ae8x2utveqcjhwc4lh668u6j9k05swctmju7vgty0yv97s', tnamAddress: 'tnam1qzpmzpzrcq3p90877psw9efk0wmf9gm2myt5v2sl', initialAllocation: parseAllocation('54.224,98'), currentBalance: 'Loading...' },
    { name: 'Agung_laksana', tpknamAddress: 'tpknam1qqddl24f83yuwm573g0x7gqvlltrfy500c4y2tdje3xsam20cas0zf4eex7', tnamAddress: 'tnam1qpytpjjfdeq2jkph8alwradf7cl6t7clsstdypp9', initialAllocation: parseAllocation('53.623,82'), currentBalance: 'Loading...' },
    { name: 'plsgiveup', tpknamAddress: 'tpknam1qp5jhnygn74s8x3q43s6tscz6thwfs6pjga0gh5qxlk3xzdhu48wy7hxfdf', tnamAddress: 'tnam1qpawc283w90rz0xg54r69mdf25h5d26tac47g3uq', initialAllocation: parseAllocation('52.301,26'), currentBalance: 'Loading...' },
    { name: 'KingSuper', tpknamAddress: 'tpknam1qzluhwmzp9aek7hpvj8a2q8afacw4gcjs5g457cjq4l5sfuqj8dd2w26hqw', tnamAddress: 'tnam1qpz93yrdr7d8g773lxj4h53c27kudz3ddvl9yd46', initialAllocation: parseAllocation('51.219,16'), currentBalance: 'Loading...' },
    { name: 'web34ever', tpknamAddress: 'tpknam1qplcr82t6y4hnaj4re3k3qw2kfxt6mugmwsvpaw2h4q4z8p4k634ja2htxv', tnamAddress: 'tnam1qqgxklf5aj7ttqrgt7tuj3hs2z7uxu8e0uw96sh9', initialAllocation: parseAllocation('51.098,93'), currentBalance: 'Loading...' },
    { name: 'cyberG', tpknamAddress: 'tpknam1qpk6vl0yll8xfshacgvsv8vegzr8jegkmuaz2g0cvsnupgdvxht4u30e92g', tnamAddress: 'tnam1qps7f03vx5fr2f4sk3q9z7my2l3p0j0lds3aart2', initialAllocation: parseAllocation('49.535,90'), currentBalance: 'Loading...' },
    { name: 'GV-SwissStaking', tpknamAddress: 'tpknam1qrftqvcfyh5059udhfl5u9tz8jsnd0xkachnvpahggu7jng22a42vt5h32k', tnamAddress: 'tnam1qpctqz5ef7a7pzth8cphxhcvzsgfx2qngu4zmq5s', initialAllocation: parseAllocation('49.295,44'), currentBalance: 'Loading...' },
    { name: 'Cosmic Validator', tpknamAddress: 'tpknam1qqxgd638f0efxzzx3lpk6m73kf4k80stlhdm6z2gymxzh3zk6g54u6enxjf', tnamAddress: 'tnam1qzkzxmahynhs5p9j09hn65yg0q2h755vuuq39a4e', initialAllocation: parseAllocation('49.175,20'), currentBalance: 'Loading...' },
    { name: 'bosscrypto', tpknamAddress: 'tpknam1qrnu7qjnf3fga6754xl8ppexzr5qszctsezcdgsf74yzrtuq6ha7jezeaxh', tnamAddress: 'tnam1qqr4n35rj0tr2tcnd0kxhwmuplnjt7yncc85zhh2', initialAllocation: parseAllocation('48.934,74'), currentBalance: 'Loading...' },
    { name: 'Atalma', tpknamAddress: 'tpknam1qzxd9htedmvwl07008q2k6kkfhl49y4qxur0qlssv8qtml6ulz836a0jhpc', tnamAddress: 'tnam1qpccrrpcqf8qfyfz52w74h7v885dkt248cjpjse5', initialAllocation: parseAllocation('48.814,50'), currentBalance: 'Loading...' },
    { name: 'zoz', tpknamAddress: 'tpknam1qzw8l6n29y9tctss0n60urzk0k7g5c63pjck6ysldw4w8etlz4ce70hczrw', tnamAddress: 'tnam1qry7uxnzawcs425tjlxmllw276pr6c8qg5ytv07c', initialAllocation: parseAllocation('48.213,34'), currentBalance: 'Loading...' },
    { name: 'Lavender_FiveNodes', tpknamAddress: 'tpknam1qqxfnr84g6qyqut845fh0zmyswr5y00zedklxmjcpn862x0mxjg9kz5arr6', tnamAddress: 'tnam1qppww2y4kfg9p0xx4m730kaxnnwxtjc47c7v432v', initialAllocation: parseAllocation('47.131,25'), currentBalance: 'Loading...' },
    { name: 'ZecHub', tpknamAddress: 'tpknam1qq9zjdua7jhcnuv7cjgzpu4syd8rmrn4zgcfvea03v4d4skprt84qm27tev', tnamAddress: 'tnam1qqs5fuz88hhwyau86cr26u0hh4p6afu0lqwlhdqf', initialAllocation: parseAllocation('46.530,08'), currentBalance: 'Loading...' },
    { name: 'moodman-solution', tpknamAddress: 'tpknam1qqkkj4s8ctnn0zgtgn06uarg2jd7wucvg292flg3qywezkrau7e868rc9sg', tnamAddress: 'tnam1qz0sx92fevw4caq89j3hvp93p6epczcwwsvyc53q', initialAllocation: parseAllocation('46.289,62'), currentBalance: 'Loading...' },
    { name: 'PurpleMoney', tpknamAddress: 'tpknam1qzpnh695ghwmzutcca39g4gm3uqftslk8n6tkredzgkh6pyyanqvsxqh4j9', tnamAddress: 'tnam1qze8w6y6v8a2qsa0xs7sh4tgfwzckh0slggyupd0', initialAllocation: parseAllocation('45.928,92'), currentBalance: 'Loading...' },
    { name: 'Kekeii', tpknamAddress: 'tpknam1qq8vh9rc3q0kgra6lnhy5zzamzz4z2uxwtsau4gg0gzepfqwu6pqx82485d', tnamAddress: 'tnam1qrfar8pkacu0pct6540yrpq8m46yz688ssf9rdq5', initialAllocation: parseAllocation('45.688,45'), currentBalance: 'Loading...' },
    { name: 'zerokn0wledge_', tpknamAddress: 'tpknam1qzdqgxukzx74a7rled0cfh9an5qldn8t8pnfutp6sj8dewu29d4u5pnlsj6', tnamAddress: 'tnam1qp5amhzzg94tsh9geqdn0e4u3prup5hamcgl2zvc', initialAllocation: parseAllocation('44.606,36'), currentBalance: 'Loading...' },
    { name: 'AAN | CDI', tpknamAddress: 'tpknam1qrusk64akxuw7dg0aa380cuc3rneaqdwv2r9a0xcgp7q3y0wjshvz65l0s4', tnamAddress: 'tnam1qr6fxq4qttm4p0gd2e364rsmp64dvqg62yvmc67r', initialAllocation: parseAllocation('43.524,26'), currentBalance: 'Loading...' },
    { name: 'Fuji AR', tpknamAddress: 'tpknam1qzsrvlu3k4v9gphy23h77skeq9a7jl2wmf5sy07j4k0jqqqa2ly4ydrzqq2', tnamAddress: 'tnam1qpp2ajul3kgvxfxyy68w2vfya9ykpktfzgmpdvhm', initialAllocation: parseAllocation('43.163,56'), currentBalance: 'Loading...' },
    { name: 'ptzruslan', tpknamAddress: 'tpknam1qq4ykxcn9mm53qk8l0z3uw4xe3jzsxk3xmf88lm4wevkm8ytefj3c8z33pd', tnamAddress: 'tnam1qz4kqu495qne6ue0382v7hw2cmvcvew5wvk5v73k', initialAllocation: parseAllocation('41.360,07'), currentBalance: 'Loading...' },
    { name: 'silent666', tpknamAddress: 'tpknam1qrmdu5pkulcywh6gyfcm0j0jm3fyalmq6nue99t7ez4vhex6dfpzqz4nmpm', tnamAddress: 'tnam1qp08xqts572xznned3whfv07vw2kacjzty5qc7xk', initialAllocation: parseAllocation('40.879,14'), currentBalance: 'Loading...' },
    { name: 'Arash', tpknamAddress: 'tpknam1qpdtdgrtq8hx6lpuezh9jkckg95rtcsmz04q2jhfr3z8aq8etfj3vfdyhjs', tnamAddress: 'tnam1qq4mfeeagxx6aqsl2mvs2clx7zcfhgenecg4yell', initialAllocation: parseAllocation('40.638,68'), currentBalance: 'Loading...' },
    { name: 'Nami077', tpknamAddress: 'tpknam1qztlxqwt3t88p0q52akvjj5ats226xt7gecx2pncktutmzxrva47jesdda6', tnamAddress: 'tnam1qzag0hanure9r7mzx688k6tx6jwfplme6gxtd4hr', initialAllocation: parseAllocation('40.277,98'), currentBalance: 'Loading...' },
    { name: 'rexslash', tpknamAddress: 'tpknam1qqkmu3vkm8tzr99rjvms6gt0rclkmpzcmveetx8zj72lm7w7qx325zdzksz', tnamAddress: 'tnam1qzteh6symphlg0yvfjmmk45ef83l0hxvrqd34j48', initialAllocation: parseAllocation('39.917,28'), currentBalance: 'Loading...' },
    { name: 'aliefaisala', tpknamAddress: 'tpknam1qzt063e3mj5z0ycfdj445m48q859m5trsdece530zlxg07y8nqlmg8g3jtk', tnamAddress: 'tnam1qp9slejdxvanu7mttqt8yyj07unxq4n0uv7292mr', initialAllocation: parseAllocation('39.676,81'), currentBalance: 'Loading...' },
    { name: 'tr0uva1lle', tpknamAddress: 'tpknam1qzwrdttjrnc4nc546dflnwtnkmfgffyrgvfu2mru3y72jurz89mr7v4kgp9', tnamAddress: 'tnam1qz4r8wur6rx20sx5kknktqatvh2zxujz3vk6pdp2', initialAllocation: parseAllocation('39.676,81'), currentBalance: 'Loading...' },
    { name: 'Alexander | P2P.org', tpknamAddress: 'tpknam1qquzgwany3n53uy2f8gpugm6h7qyf6mekx9jlr7rtwmvd6z0624xu2rvkre', tnamAddress: 'tnam1qp96jsc6d5dfs6hfu2yglvsagsdpmd0dwghsdmaq', initialAllocation: parseAllocation('38.113,79'), currentBalance: 'Loading...' },
    { name: '! .sipalingtestnet', tpknamAddress: 'tpknam1qzf5scxn8q44pw0xs9pxp7vsxcvel3t4d9hw0t3hrkxc7xhduyq3yvp9rg8', tnamAddress: 'tnam1qzdtn3u539943gdlmwd7pjmrd960dw39cqha9lsv', initialAllocation: parseAllocation('38.113,79'), currentBalance: 'Loading...' },
    { name: 'Mehmedialem', tpknamAddress: 'tpknam1qzvxwvfttgmel6pkjaw29fsvp7z2c94gevdl4cu70l554f2hlxlz2dasdtq', tnamAddress: 'tnam1qpsj72pfjn5jzawzq8yrvdk79u76dwher5vdrpmf', initialAllocation: parseAllocation('37.151,93'), currentBalance: 'Loading...' },
    { name: 'oowwll', tpknamAddress: 'tpknam1qz5t8lasp7dk7arvw38c94ltkyns04ahjnf509zh3zutfpjeandrcjf5uzw', tnamAddress: 'tnam1qrw6dle45ld8acfryk0eaumezrfqge5gkctgjsaj', initialAllocation: parseAllocation('36.911,46'), currentBalance: 'Loading...' },
    { name: 'Brightlystake', tpknamAddress: 'tpknam1qppm6p5zqf9r2y03tg3mwjrknkdyvy2pl3t9cv2uqx8rmrfswjyhz7pulg5', tnamAddress: 'tnam1qqk3t289f5heaerrjvpxjh2exjp2lfw57sc0nslj', initialAllocation: parseAllocation('36.550,76'), currentBalance: 'Loading...' },
    { name: 'InCase', tpknamAddress: 'tpknam1qp2w5qkn326yeszz7wavrjsvavwg2mzwmwxv4k8q20v7rl8e2acusx3qqy7', tnamAddress: 'tnam1qrc2fcehlyktz5w99hagvpalyazeu7wthqk4f5cp', initialAllocation: parseAllocation('35.588,90'), currentBalance: 'Loading...' },
    { name: 'egormajj', tpknamAddress: 'tpknam1qzhrdrhag735hs9up3fhsmw5dmrlx05cumhfvzpe2s8cn0yy9036ygykg70', tnamAddress: 'tnam1qrm0my8cyv4mqn22ukx24y7xexzqxfk6mcnldqkd', initialAllocation: parseAllocation('35.228,20'), currentBalance: 'Loading...' },
    { name: 'cryptomolot', tpknamAddress: 'tpknam1qpt9ms4jhry5nsx7xal2wyvatv8tsyqts96a36ln25wdvf4evtw268pn32l', tnamAddress: 'tnam1qqa8l58hhj2mkswta50qe0cz2rtn5nrhxsfxzr5e', initialAllocation: parseAllocation('35.107,97'), currentBalance: 'Loading...' },
    { name: 'NickShakel', tpknamAddress: 'tpknam1qzr5f4qcny0eq820u65lglxvu32ppx25r98caa9ly2efmqfq89u82cjqmya', tnamAddress: 'tnam1qrczdnnzswpyfaf56q4899r5shrtljugq58f506l', initialAllocation: parseAllocation('35.107,97'), currentBalance: 'Loading...' },
    { name: 'Pansophic Chad', tpknamAddress: 'tpknam1qpln7960sfx3tfvvzm5nfeetdrzvwgw7xxpqzek5w59ae56tugy3u87d753', tnamAddress: 'tnam1qq4r7d0f97qlek0npp84vnnjlaeg6g5etyjcgjc5', initialAllocation: parseAllocation('34.987,74'), currentBalance: 'Loading...' },
    { name: 'sayin7', tpknamAddress: 'tpknam1qqpxsr4twjlny4cwakfysvyf9rz455knpx99puvfln5pqy9pyc70xgtga6z', tnamAddress: 'tnam1qr47uerf9ae54sa2s9e782je06jyn8msmucycskh', initialAllocation: parseAllocation('34.987,74'), currentBalance: 'Loading...' },
    { name: 'shoni_crypto', tpknamAddress: 'tpknam1qp7vt805k95k52zjkkwqkmj9j353cvvwedggtjadtdwvhnlanydk2sn664h', tnamAddress: 'tnam1qrujxec7s4ut6ml29aau6t27ka5fv2qemszzpr22', initialAllocation: parseAllocation('33.905,64'), currentBalance: 'Loading...' },
    { name: 'niocrisnode', tpknamAddress: 'tpknam1qq3fyd2ct3cfykva9k5cm2kg7ctkhns40ddk5p97rcyv7hsndm30chvfgdg', tnamAddress: 'tnam1qpq6g44x78uxh7yha9m7cnkenmw3mlnmhg9fkzne', initialAllocation: parseAllocation('33.665,18'), currentBalance: 'Loading...' },
    { name: 'kunyoung kim', tpknamAddress: 'tpknam1qr42lns82et2t5mzfqyurqqa6fjznrk7nahef2g6prsdfzp80mnlc9v2ms4', tnamAddress: 'tnam1qpkeftsa6jhzdfalmxavw4njg7kz9qy7d5cyffs0', initialAllocation: parseAllocation('32.823,55'), currentBalance: 'Loading...' },
    { name: 'lovecity', tpknamAddress: 'tpknam1qzqvghlkf7zl5304hu3pwyzl4fr5sprr3ddtqqjcpxrk6y7063v927q8qe5', tnamAddress: 'tnam1qr2wpxs9maznhjmalzqqf83wpqzq48dp6c2vx8rq', initialAllocation: parseAllocation('31.981,92'), currentBalance: 'Loading...' },
    { name: 'Wufangfang', tpknamAddress: 'tpknam1qzndq3sytzpv6z0t6ufug47g7kc0x7xpk3d228swfy3rz2zlp7v8cmd2xt8', tnamAddress: 'tnam1qqg35pa05tq9yvf2t7vauzvku7mknwe5w5jzs8ew', initialAllocation: parseAllocation('30.899,82'), currentBalance: 'Loading...' },
    { name: 'Beta', tpknamAddress: 'tpknam1qrlz530nm7v33jndz8tnddweq0umvzquj3tzse3y555ztl2hshet5vssvjn', tnamAddress: 'tnam1qqy54murmd83htykfvp43ye4accpwyszd5fhm36c', initialAllocation: parseAllocation('30.779,59'), currentBalance: 'Loading...' },
    { name: 'Emzod', tpknamAddress: 'tpknam1qqnr0s5fd582r6wj6yt62yl9h25sryd3ahr0guv5mf2mf4etfuvgkvpgg39', tnamAddress: 'tnam1qrngzd9drjyk4zmep2nzumt7ts4mxrswusd6eez7', initialAllocation: parseAllocation('30.539,12'), currentBalance: 'Loading...' },
    { name: 'romanv1812', tpknamAddress: 'tpknam1qp8annn5jp3jkhj7pqa93f8ftr2ygmmwvtzgyapjh0uv95fgwlzxvayv73k', tnamAddress: 'tnam1qqwdyzrjm00gutgl0rr3dn7tmnfwwaeycyxq7u73', initialAllocation: parseAllocation('30.539,12'), currentBalance: 'Loading...' },
    { name: 'ivanbro1', tpknamAddress: 'tpknam1qr3tv809r95zhmppxv6tx4xggw95k74nl0lv6msv0smld6ygrk3ay9qzj9f', tnamAddress: 'tnam1qrvlqt8kwzdmr98j2avqdre66r9n0hjw0yxpr602', initialAllocation: parseAllocation('30.298,66'), currentBalance: 'Loading...' },
    { name: 'brsbtc', tpknamAddress: 'tpknam1qq9h4y0ffq8a0xwcwdwc6mwjwntzcskekm8k6ljp7yxhqfuuwanlw8qryut', tnamAddress: 'tnam1qzyu9e9dr8w45lnp5g0j9tjs2s7v2knk2qgcmmrd', initialAllocation: parseAllocation('30.178,43'), currentBalance: 'Loading...' },
    { name: 'IONode Vietnam', tpknamAddress: 'tpknam1qp7yy6nz66pzffgmsjtvecnrrrgjc7vzqg8taspcwtc2ye4rr0xs6c90nl4', tnamAddress: 'tnam1qpnypzzpc2hqvtvcvqzy5d5jj3u5g3q3wq9svqdz', initialAllocation: parseAllocation('29.577,26'), currentBalance: 'Loading...' },
    { name: 'Muxa1lo', tpknamAddress: 'tpknam1qpg0jsart64ve2m45pals2jzmcactg69smw8qhpcx7qpt7knjc907485k47', tnamAddress: 'tnam1qztengpreuc6l3wfr0ks3k7wfgt6yrmyg5j7lhnh', initialAllocation: parseAllocation('29.216,56'), currentBalance: 'Loading...' },
    { name: 'tantalum666', tpknamAddress: 'tpknam1qp98x87a9ss7sqw7p5ey3jcupk6afhlutcjkmq884vs4hxgunhmdytuf546', tnamAddress: 'tnam1qpur87kyc8fcuq8mufg80ex96y9h8e9lfvg533kh', initialAllocation: parseAllocation('28.615,40'), currentBalance: 'Loading...' },
    { name: 'Vlad_', tpknamAddress: 'tpknam1qqpyrgm40qp3lhvv7f78jz55av6nxxx3ntffrmpxs0vxa0c78nph660llkw', tnamAddress: 'tnam1qzsx0r69r6vngz9t6xsc2syhs7lranfpj5ums99z', initialAllocation: parseAllocation('28.615,40'), currentBalance: 'Loading...' },
    { name: 'POR | ContributionDAO', tpknamAddress: 'tpknam1qqenh7rse4cupeagh3t2vmjf9e9z9pgmmzq36jh2udrmj4jpvzdc2wd4x5t', tnamAddress: 'tnam1qz7cdegfcyamm895eq0w9e8hspacnfm8rgg5at4c', initialAllocation: parseAllocation('28.615,40'), currentBalance: 'Loading...' },
    { name: 'freeds', tpknamAddress: 'tpknam1qrc60zwxx4adufylpls7g3s30m02mml4ncuy8tld9mvdaw0xzstjcxcvsv5', tnamAddress: 'tnam1qrnfm55jgspanjxlmu4vlm25v5yv5lwuzy2dwqxz', initialAllocation: parseAllocation('28.254,70'), currentBalance: 'Loading...' },
    { name: 'STAKR.space', tpknamAddress: 'tpknam1qp8h4cqaw5z5dr4w29kg6l033rqsu525mmy325wt5ampj4tyw6lv7zcvg3z', tnamAddress: 'tnam1qpvq6du2y9635p49kc2tjw55yx8k2d4caufp538z', initialAllocation: parseAllocation('28.254,70'), currentBalance: 'Loading...' },
    { name: 'seb160', tpknamAddress: 'tpknam1qrvzme6s0zfz2ag3v83s5jj5a4tpl2fp6z6trfmvynzzw3pe0lrew2flu8w', tnamAddress: 'tnam1qpw2twd7ayeq7lq9c7ly5rmrcdfv89zrzqnwztn7', initialAllocation: parseAllocation('26.932,14'), currentBalance: 'Loading...' },
    { name: 'Daviduok', tpknamAddress: 'tpknam1qrkmz977cjm6273jknkptvq6d8xxzed9jh6lsyth95a6jyqhfs4zye2u8mx', tnamAddress: 'tnam1qz5q2xmzk0w9ffymxzyrlfn8gw3h5xw32gryxqpw', initialAllocation: parseAllocation('26.691,68'), currentBalance: 'Loading...' },
    { name: 'Melody555', tpknamAddress: 'tpknam1qrh0977c4vmtujw0qekq52gum9tylu8asg2hpm84wq3fcnmyy754y0sktvh', tnamAddress: 'tnam1qrzhx02d7tv56m9626t08yc25tsucz6s95z0gtrw', initialAllocation: parseAllocation('25.850,05'), currentBalance: 'Loading...' },
    { name: 'genue', tpknamAddress: 'tpknam1qz7mf6jra6vcyvvxnl33chhquqmthaag68z7h562nrxnqrqcdxgd5mmsd9d', tnamAddress: 'tnam1qzne0heq0lh7pugcxqvmvswahsahqnauty62te90', initialAllocation: parseAllocation('25.248,88'), currentBalance: 'Loading...' },
    { name: 'mdlog', tpknamAddress: 'tpknam1qzxu9taxnrrek3ty4mh5gl0rp9s05l5j58tn7kspj22mpp5s8nwywqgdqmv', tnamAddress: 'tnam1qpl8w4vjsh7vhh6ruf0qaer0ehx6yt8e95xldfmr', initialAllocation: parseAllocation('25.128,65'), currentBalance: 'Loading...' },
    { name: 'Namex', tpknamAddress: 'tpknam1qznr9zqpynueyke0tws7ly528wvxtyyak3tfw7gmxp4t9022y06lv0atp50', tnamAddress: 'tnam1qqxcke4uxl77jd0rapggam0yws864y45ggnztx9g', initialAllocation: parseAllocation('25.008,42'), currentBalance: 'Loading...' },
    { name: 'Zener', tpknamAddress: 'tpknam1qz54y37xsay6kz9ynhpe57jtr3cjf5u40rmhpk5czd77fzpqzj72g3vntmh', tnamAddress: 'tnam1qqf38cxavw8tt7l5y34zr4jln5ysmay5vc7cr5ze', initialAllocation: parseAllocation('24.046,55'), currentBalance: 'Loading...' },
    { name: 'garmien', tpknamAddress: 'tpknam1qq3xnf0282jtzyvmj9y3mg9mw9ndchd6r28eatpjgvwpfwp5wldqgf3kryf', tnamAddress: 'tnam1qqd0g8eeq67kta4rfwt25y5ahv9h2kxrgsz37ag7', initialAllocation: parseAllocation('23.926,32'), currentBalance: 'Loading...' },
    { name: 'Pablo@Pablo-Lema.com Address 1', tpknamAddress: 'tpknam1qzcex3unpstpy90twqhn5pz6mldk0p5az8zxwp5fzfnafs7fkeh6zndvp3p', tnamAddress: 'tnam1qqcvttrz8e9ej3cxnhdvz4g74mkrgt06w5faq98w', initialAllocation: parseAllocation('23.806,09'), currentBalance: 'Loading...' },
    { name: 'cryon', tpknamAddress: 'tpknam1qqndl7dy92x0qs2twkmuv5qw6vw9ktefp6zwgywcw6tqg6msm5dnglspnff', tnamAddress: 'tnam1qqj78m84le66kxr7l8lmmtxkq2huusvtnvfc5v8a', initialAllocation: parseAllocation('23.685,86'), currentBalance: 'Loading...' },
    { name: 'SerCry', tpknamAddress: 'tpknam1qrv8hgcnzw7uayu4z00nkurv70cvxrs65mxvgv0sd79shx5mf2t45hjqca6', tnamAddress: 'tnam1qzd5mqyn0fcezhxcll28duuvn7snqetv7mut80k3w', initialAllocation: parseAllocation('23.445,39'), currentBalance: 'Loading...' },
    { name: 'sam_wang1', tpknamAddress: 'tpknam1qqxhdns4zcrvqd32tcaeapjtpdpwhek2ufurvzsy27qx8lmvxtae5dq2n3d', tnamAddress: 'tnam1qz3t05lnpmm8lxjjrrg5k87mq3xn78vvq5nhu3zf', initialAllocation: parseAllocation('23.204,92'), currentBalance: 'Loading...' },
    { name: 'SelimC', tpknamAddress: 'tpknam1qz889spy5x3fylgekk2jz5wde7whchq4es7tnmwcl7y2vx5fuueq26fcny2', tnamAddress: 'tnam1qpks9c28flkxwqpaqtm63snf2gcaw4gc7vdkthau', initialAllocation: parseAllocation('22.964,46'), currentBalance: 'Loading...' },
    { name: 'Levels | Nocturnal Labs', tpknamAddress: 'tpknam1qz5w4ssv37suh86ga3ast5whd62k5c6mtm8hy2dptyhp2nhhancakxd9suj', tnamAddress: 'tnam1qzlhpv900ps0js2xlqjr0rx7p6xs4w3nxc34cv0h', initialAllocation: parseAllocation('22.483,53'), currentBalance: 'Loading...' },
    { name: 'Brian Bitberi', tpknamAddress: 'tpknam1qz4et4q92qp93xesvl7arp0f958n7x8j4g8my03xw4hps6yqvkuaqgwj0hl', tnamAddress: 'tnam1qrxlse6r56e97h285hfme38ytetlpg9hjq56xhrv', initialAllocation: parseAllocation('22.363,30'), currentBalance: 'Loading...' },
    { name: 'Badalister', tpknamAddress: 'tpknam1qr68g9j5dqphzcw860fzpxvycxlt4kp5taxlgq0zknx0f8pnjrl8jyu7qcj', tnamAddress: 'tnam1qp7ckftuftqsqu9e9przy89p02a58w8rputgvcah', initialAllocation: parseAllocation('22.363,30'), currentBalance: 'Loading...' },
    { name: 'tRDM', tpknamAddress: 'tpknam1qre03yq7fep3gnrut35e34yzcddzcpu08ymyrug9yqg85l8e3g95qge56sp', tnamAddress: 'tnam1qrw5ksvkde67yh5cq99k2da2sltjdcyahcqqejsp', initialAllocation: parseAllocation('21.521,67'), currentBalance: 'Loading...' },
    { name: 'Dered', tpknamAddress: 'tpknam1qqls382n66hh4x6zadk4mc08lqvgru07epphw63nw79jpmn73z4ds9xjc90', tnamAddress: 'tnam1qqcn4ztxwk7sz5030ufnyghwedjg4r8vpv9v5e7h', initialAllocation: parseAllocation('21.521,67'), currentBalance: 'Loading...' },
    { name: 'Maria_G', tpknamAddress: 'tpknam1qqxs42y8s2aks33x7wudlvfcql8xhnzulfttfc6qlg2d5hj82gfs67jw4d4', tnamAddress: 'tnam1qzuufzw2q88tuxzkpag239g0vzy9y23d0yfpfnjx', initialAllocation: parseAllocation('20.680,04'), currentBalance: 'Loading...' },
    { name: 'Node Guardians', tpknamAddress: 'tpknam1qzmwdhzu96mvmcah0l0kr9t3gshkgq2papatnx27xeuxn28ryeuc6t6pnaq', tnamAddress: 'tnam1qqd82j09mhux6rr6hkcap78ulcmrdnxchgluf4yw', initialAllocation: parseAllocation('20.078,87'), currentBalance: 'Loading...' },
    { name: 'Hitasyurek', tpknamAddress: 'tpknam1qz0tfl4v5upke06xka7a6epmqx7ar7ehtzuky2ejvmruahv8h2jhcseemep', tnamAddress: 'tnam1qqv89f8jlk47g22depen3nwfsmtp37f3lq5grv9m', initialAllocation: parseAllocation('19.958,64'), currentBalance: 'Loading...' },
    { name: 'Antoine', tpknamAddress: '', tnamAddress: '', initialAllocation: parseAllocation('19.477,71'), currentBalance: 'N/A' },
    { name: 'briandora', tpknamAddress: '', tnamAddress: '', initialAllocation: parseAllocation('19.237,24'), currentBalance: 'N/A' },
    { name: 'mrjw', tpknamAddress: 'tpknam1qpvtjd2tkayqcu07qckzpvseagxn5sl5s5nh0mhwj46w679zkx5kuy4yz36', tnamAddress: 'tnam1qp9czmscrkzndtr0p7kyhfh8cykjayg45uycxwah', initialAllocation: parseAllocation('18.876,54'), currentBalance: 'Loading...' },
    { name: 'keozz', tpknamAddress: 'tpknam1qpa50c8magc62sy4wtla03gxc3vkqy784mca4scxrm3z97myrmyzj6jpsx5', tnamAddress: 'tnam1qqwrm0edpqm3lvqqc5lq625zh5uqdh2swcmdr95v', initialAllocation: parseAllocation('18.515,85'), currentBalance: 'Loading...' },
    { name: 'Firo', tpknamAddress: 'tpknam1qp26f5nlx337kezj3et9d78dx5k9tn06tnnpx6rc2ge58duct7davqm6fns', tnamAddress: 'tnam1qqxh4lgxpvrxn7yudgk3v8resfhcrhsnmg7um7kj', initialAllocation: parseAllocation('18.275,38'), currentBalance: 'Loading...' },
    { name: 'fef', tpknamAddress: 'tpknam1qzlf8prqs9t4anghmruqq0r8spj05gxwe3ghf6rw72azlq2km63a2rq7sy4', tnamAddress: 'tnam1qq0mx83lu95657amjpsmz8tlhtp0e4lxhvsru8su', initialAllocation: parseAllocation('18.155,15'), currentBalance: 'Loading...' },
    { name: 'Astronomica', tpknamAddress: 'tpknam1qrt2sg8dzj0l5qfec9akgfwt3nm926a9xx4ezn77pn70rqrsthgr6y3f3g2', tnamAddress: 'tnam1qrep2wj59q9flrdj9xxmyy7dlmw3pzpdly0etdvr', initialAllocation: parseAllocation('17.914,68'), currentBalance: 'Loading...' },
    { name: 'hikicha0_0', tpknamAddress: 'tpknam1qz95klmxtcxc8gt50dh8lyena5hpjl4k5wfnvrqffc33dfte73ezxeefzaa', tnamAddress: 'tnam1qrtczn3c0p8qsx4m7r2eu8je8kpeju7wsyx5pc4t', initialAllocation: parseAllocation('17.914,68'), currentBalance: 'Loading...' },
    { name: 'mztacat', tpknamAddress: 'tpknam1qqsj7ur88x3hc9pwgggp3wa602vxppq5mnz4kt7qhkuqarajwu69cc4lm3l', tnamAddress: 'tnam1qz6uyk3eh44asmx6qscstykgvpayz2rk6chu4lm2', initialAllocation: parseAllocation('17.313,52'), currentBalance: 'Loading...' },
    { name: 'whiterose420', tpknamAddress: '', tnamAddress: '', initialAllocation: parseAllocation('17.313,52'), currentBalance: 'N/A' },
    { name: 'Gruberx', tpknamAddress: 'tpknam1qzc2ddxdyw7045ju6w7pgz25cuqvcvge7yn6cmqstjtxjdr6k437z6vahl6', tnamAddress: 'tnam1qqcgdmzqqcgnxw4n7evhaurnrly9utdmlu5jwmwn', initialAllocation: parseAllocation('17.313,52'), currentBalance: 'Loading...' },
    { name: 'Vincagame', tpknamAddress: 'tpknam1qqa9pnn84wcwj7dmsl955e8navrwqsu07vkzdzpqa6mjwgksxqmlw2ycnd2', tnamAddress: 'tnam1qz9985v4wx4v743nzhsaurvkf2a8c7kuny4mwtt8', initialAllocation: parseAllocation('16.592,12'), currentBalance: 'Loading...' },
    { name: 'kuzey', tpknamAddress: 'tpknam1qzvkxv2hg7hmjsurgzujn9c7mgnguqwpu7acsm0tcjtfecvjqttsvpjurz9', tnamAddress: 'tnam1qqe7z8y40tpx5n2mdpg7dg40h8amj8n27gtzqkkh', initialAllocation: parseAllocation('15.870,73'), currentBalance: 'Loading...' },
    { name: 'buidlfren', tpknamAddress: '', tnamAddress: '', initialAllocation: parseAllocation('15.870,73'), currentBalance: 'N/A' },
    { name: 'du333', tpknamAddress: 'tpknam1qpcv9tkqu9c7dwukngwdtgk7uuh2jppctfhzu6aewk5j3kqrx36mcleud3x', tnamAddress: 'tnam1qrfayzdmhnuemuv7nj3env8m2nftgzudyc26pv5j', initialAllocation: parseAllocation('15.870,73'), currentBalance: 'Loading...' },
    { name: 'Hypatia', tpknamAddress: 'tpknam1qq9ljhlzyqu5kl4l8l3dxsevw38k5r0awwp0mlfrlyyp52778y03qjh2eqj', tnamAddress: 'tnam1qpj0h58je2upsa2qs00tcnvhru5xmvtrws43fqjt', initialAllocation: parseAllocation('15.750,49'), currentBalance: 'Loading...' },
    { name: 'kriptoboss', tpknamAddress: 'tpknam1qrnu7qjnf3fga6754xl8ppexzr5qszctsezcdgsf74yzrtuq6ha7jezeaxh', tnamAddress: 'tnam1qqr4n35rj0tr2tcnd0kxhwmuplnjt7yncc85zhh2', initialAllocation: parseAllocation('15.510,03'), currentBalance: 'Loading...' },
    { name: 'Cryptobox', tpknamAddress: 'tpknam1qp5nys0jkpasdqmxt9qc5m4gm3ahh99x6ecw08j6mtxd66ulpvcxyng9k6a', tnamAddress: 'tnam1qrhcnzgzmd5342hszzs06yxfyz63sptflq2djyhj', initialAllocation: parseAllocation('15.389,79'), currentBalance: 'Loading...' },
    { name: 'Oneplus', tpknamAddress: 'tpknam1qrn8l63h6pmzjxplrvcw0vsx3p4s78yd8nd278pzvfwke9rw3swpx0a0xl9', tnamAddress: 'tnam1qpfl7yxqyywcjgn38fwtzsur2dp4ktqqyspk29f7', initialAllocation: parseAllocation('15.389,79'), currentBalance: 'Loading...' },
    { name: 'skilly', tpknamAddress: 'tpknam1qzv9qf0affy57m0ptm3vh64ahefc5hv8xhxq782kwq0s45xwrzkukcfsnx9', tnamAddress: 'tnam1qqtuqxy7akeeea2e2sc3e9hy6p7vj947r5dmphuv', initialAllocation: parseAllocation('14.908,86'), currentBalance: 'Loading...' },
    { name: 'TraderOzy', tpknamAddress: 'tpknam1qrzlrzxmx4jvf9n9ym79ulw0j9w53e4uz9aly7kk2eyh29srgge3z87km2x', tnamAddress: 'tnam1qrfnrdmdr7q0l9pnetsyc8mdec0waennfcyj8vl3', initialAllocation: parseAllocation('13.225,60'), currentBalance: 'Loading...' },
    { name: 'JUN_GALXE', tpknamAddress: 'tpknam1qz8pqds5a0klskx9h6y6hlffvp4jchfcpxq276ck03c4eu4rfa7vzt0jca6', tnamAddress: 'tnam1qrek3uzr0m7qnum6w9wkc40aurdtqq54xysyalxg', initialAllocation: parseAllocation('12.864,91'), currentBalance: 'Loading...' },
    { name: 'heejin lee', tpknamAddress: 'tpknam1qp74nla3cjqsc7qm2s6x7pk2mdaf60mmz7qvrhm44qrk2y749t2ykeyx4wh', tnamAddress: 'tnam1qze5dz3fsh3jccanjvm3g0jfrhrx9t98k5auckcp', initialAllocation: parseAllocation('12.504,21'), currentBalance: 'Loading...' },
    { name: 'Essiraer', tpknamAddress: 'tpknam1qzfj4yyz9px96nt6txmspltygwrc4shtldddaq58n45z27j6gqh7zza2w6e', tnamAddress: 'tnam1qphk0jsvpwnrrespgpzf3xel3hhcw23c9g0mjstg', initialAllocation: parseAllocation('12.383,98'), currentBalance: 'Loading...' },
    { name: 'StraiK80097576', tpknamAddress: 'tpknam1qryj5xlffp0wncxxr8htssjf728mjlakjpqw4wdra9n3exyem5ev70w6263', tnamAddress: 'tnam1qp6ep3h854ucc06p35d7hr0vx3nprft0zgjz8gza', initialAllocation: parseAllocation('11.903,04'), currentBalance: 'Loading...' },
    { name: 'ghotoman', tpknamAddress: 'tpknam1qquukpc2ncjtdvjkyzxrpwk6vdee46u6aa49qz06sv74ctrkr2mv5v7hhvd', tnamAddress: 'tnam1qzx4gva6c47lq638h9tq8uhjvzqz9h2h3qhu7ps4', initialAllocation: parseAllocation('11.181,65'), currentBalance: 'Loading...' },
    { name: 'peachstake', tpknamAddress: 'tpknam1qzuj8k82mx9ct6m6kajq2y5xlzr6w64ahw7780srzv57yt9qrdrrc2anpmk', tnamAddress: 'tnam1qpvpaj4q0a7n7dlhrpsraahn8p5g5cgvuu0e42gy', initialAllocation: parseAllocation('10.941,18'), currentBalance: 'Loading...' },
    { name: 'BLACK_W9', tpknamAddress: 'tpknam1qz889spy5x3fylgekk2jz5wde7whchq4es7tnmwcl7y2vx5fuueq26fcny2', tnamAddress: 'tnam1qpks9c28flkxwqpaqtm63snf2gcaw4gc7vdkthau', initialAllocation: parseAllocation('10.941,18'), currentBalance: 'Loading...' },
    { name: 'NodeJom_', tpknamAddress: 'tpknam1qr95twkjqlygz4uxqxkfne7yweylhn6nnh4cntxfhtupnf4vfhltc5vrf8z', tnamAddress: 'tnam1qqu5ya9zda2cx56qclcllttznxm78szq75m5hrp2', initialAllocation: parseAllocation('10.460,25'), currentBalance: 'Loading...' },
    { name: 'jininja', tpknamAddress: 'tpknam1qr57t2fpynz2u7ewn3n6dgu562dxrnasu8t4lavwng3ds6uscpr758zesxd', tnamAddress: 'tnam1qrmmgupz5eelly3m2uf6kvt0pknqfl8kp59megef', initialAllocation: parseAllocation('9.859,09'), currentBalance: 'Loading...' },
    { name: 'sava', tpknamAddress: 'tpknam1qrupap6vzwzlm7cyrtvvpgp2g4l7tzxwchlt7rj0kdxtw5mkjr78qujzfwt', tnamAddress: 'tnam1qrm3ymz9mxuxygjx85qv22z3tchw6t8wdqlryf9q', initialAllocation: parseAllocation('8.536,53'), currentBalance: 'Loading...' },
    { name: 'ramonsami', tpknamAddress: 'tpknam1qqmyjjdv4cjwtq5xdpk7z0w9zactcpd4cp0vh6fggs8pzxhpguvjc9f09vm', tnamAddress: 'tnam1qqgycsaqvuez5d9a9p3kv8p4w0mj9jgxzqcwv242', initialAllocation: parseAllocation('8.536,53'), currentBalance: 'Loading...' },
    { name: 'Duc', tpknamAddress: 'tpknam1qrtnsu8rgxe0txz0er370vxqpaarcpn6qvuawqesr2atqw9t8yyrvks9667', tnamAddress: 'tnam1qpn0wjeh2fkkfjn6s5dtqlt6ufmhcup9cu979hsw', initialAllocation: parseAllocation('7.815,13'), currentBalance: 'Loading...' },
    { name: 'Kishan.Heerekar', tpknamAddress: 'tpknam1qzw3saselnhht96p40ngh2hhuaul6cfgzfzuys48mwnck26kxa8sjfmupat', tnamAddress: 'tnam1qq80294ayszwwy0gwuewp97gkr7ksw3txun9kxep', initialAllocation: parseAllocation('7.334,20'), currentBalance: 'Loading...' },
    { name: 'erkan | UniqNodes', tpknamAddress: 'tpknam1qpq7fu97ztlf3znkac6u3nlwpch0500zr8lplkkv0h40zwdmnnf76tykkcv', tnamAddress: 'tnam1qqyklrx2d5rusqujqnfku5cjy26jghv5tu2zy8gg', initialAllocation: parseAllocation('7.334,20'), currentBalance: 'Loading...' },
    { name: 'Rysiman', tpknamAddress: 'tpknam1qz2mxy87ja027x5ts3j0w86vttuf2nhd9pghmw0p868rvrhevpdsyhc9lfc', tnamAddress: 'tnam1qrzkcqjkpx6gt776zzcerex6wa0xpvw5vg5jktmq', initialAllocation: parseAllocation('7.213,97'), currentBalance: 'Loading...' },
    { name: 'JeTrix', tpknamAddress: 'tpknam1qrd43rk8te4zphfdva4vggtlu2q63lmrwufdl0nvw63mfqslkffzstttqy5', tnamAddress: 'tnam1qp937jjkmgkpaaplwnfp94r4reja2usa5v072lqz', initialAllocation: parseAllocation('6.612,80'), currentBalance: 'Loading...' },
    { name: 'mexonecrypto', tpknamAddress: 'tpknam1qr956r5q59clvqjfvrxwe6rlcnvv7cy7qs860t5g30py0msdevwhy5ygym2', tnamAddress: 'tnam1qrc0afpznwclva93vegt498kcd4cths7c5zvnvcu', initialAllocation: parseAllocation('6.612,80'), currentBalance: 'Loading...' },
    { name: 'Nazar Kk', tpknamAddress: 'tpknam1qqxwtfj2t67vxjknec4zqxchz2hejcsusffqmx02y6qafjaaatfassju8hc', tnamAddress: 'tnam1qq020c6la2zhdknuvn6exmmwdydj45a7fgfp44nf', initialAllocation: parseAllocation('5.771,17'), currentBalance: 'Loading...' },
    { name: 'nanana', tpknamAddress: 'tpknam1qzu4r49gnhspxzksshaq5wjgv4rl07ulgddjl264ns5qk8m3w9f6xnjnhw0', tnamAddress: 'tnam1qqs2jwt4ha0mnd42pxf508s5z9pdm9gre5m4v2ly', initialAllocation: parseAllocation('5.530,71'), currentBalance: 'Loading...' },
    { name: 'Army IDs', tpknamAddress: 'tpknam1qryc74l0hll4a7mt55lja5ds9deyj0lx6s64s3wgupshxx46fp03kp77shv', tnamAddress: 'tnam1qq2x8hs7kunfy7v4gjnaxa5v6js3juakhs4fmq03', initialAllocation: parseAllocation('4.568,85'), currentBalance: 'Loading...' },
    { name: 'JuliusDecaliio', tpknamAddress: '', tnamAddress: '', initialAllocation: parseAllocation('4.448,61'), currentBalance: 'N/A' },
];


/**
 * Fetches the current balance for a specific wallet address from the API.
 * @param {string} address The wallet address to check the balance for.
 * @returns {Promise<string>} The balance as a string, or 'Error' if an error occurs, or 'N/A' if not found.
 */
async function getAccountBalanceFrontend(address) {
    if (!address) return 'N/A'; // No address to fetch for

    try {
        const response = await axios.get(`${INDEXER_BASE_URL}${address}`);
        const data = response.data;

        if (Array.isArray(data)) {
            // Find the object that has tokenAddress 'tnam1q9gr66cvu4hrzm0sd5kmlnjje82gs3xlfg3v6nu7'
            const targetToken = data.find(item => item.tokenAddress === 'tnam1q9gr66cvu4hrzm0sd5kmlnjje82gs3xlfg3v6nu7');
            if (targetToken && typeof targetToken.minDenomAmount === 'string') {
                const rawAmount = BigInt(targetToken.minDenomAmount);
                const formattedAmount = (Number(rawAmount) / NAM_DENOM_FACTOR).toFixed(NAM_DECIMAL_PLACES);
                return formattedAmount;
            }
        } else if (data && data.balance && typeof data.balance.amount === 'string') {
            // Fallback for older/different API response format if applicable
            const rawAmount = BigInt(data.balance.amount);
            const formattedAmount = (Number(rawAmount) / NAM_DENOM_FACTOR).toFixed(NAM_DECIMAL_PLACES);
            return formattedAmount;
        }
        return 'N/A'; // Token or balance not found or unexpected format
    } catch (error) {
        console.error(`Error fetching balance for ${address}:`, error);
        return 'Error';
    }
}

export default function Home() {
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [sortColumn, setSortColumn] = useState(null); // State for current sort column
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        // Initialize balances with the parsed initial data
        setBalances(initialData);

        const fetchAllBalances = async () => {
            setLoading(true);
            setError(null);
            const updatedBalances = await Promise.all(
                initialData.map(async (entry) => {
                    // Only fetch if tnamAddress exists and is not 'N/A'
                    if (entry.tnamAddress && entry.tnamAddress !== 'N/A') {
                        const currentBalance = await getAccountBalanceFrontend(entry.tnamAddress);
                        return { ...entry, currentBalance };
                    }
                    return { ...entry, currentBalance: entry.currentBalance || 'N/A' }; // Ensure currentBalance is set for entries not fetched
                })
            );
            setBalances(updatedBalances);
            setLoading(false);
        };

        fetchAllBalances();
    }, []); // Empty dependency array means this runs once on mount

    // Handle sorting logic
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc'); // Default to ascending when changing column
        }
    };

    // Filtered and sorted balances
    const sortedAndFilteredBalances = useMemo(() => {
        let workableBalances = [...balances];

        // Apply search filter first
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            workableBalances = workableBalances.filter(entry =>
                entry.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                (entry.tnamAddress && entry.tnamAddress.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (entry.tpknamAddress && entry.tpknamAddress.toLowerCase().includes(lowerCaseSearchTerm)) // Include TPKNAM in search
            );
        }

        // Apply sorting
        if (sortColumn !== null) {
            workableBalances.sort((a, b) => {
                let aValue = a[sortColumn];
                let bValue = b[sortColumn];

                // Special handling for numeric columns that might be strings or 'Loading...'
                if (sortColumn === 'initialAllocation' || sortColumn === 'currentBalance') {
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);

                    // Handle NaN values during sorting: push them to the end
                    if (isNaN(aValue) && isNaN(bValue)) return 0;
                    if (isNaN(aValue)) return sortDirection === 'asc' ? 1 : -1;
                    if (isNaN(bValue)) return sortDirection === 'asc' ? -1 : 1;
                } else {
                    // For string comparisons, ensure both are strings and use localeCompare
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
                }

                if (aValue < bValue) {
                    return sortDirection === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return workableBalances;
    }, [balances, searchTerm, sortColumn, sortDirection]);


    // Function to render sorting arrow
    const renderSortArrow = (column) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? (
                <svg className="ml-1 w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                </svg>
            ) : (
                <svg className="ml-1 w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto p-4 md:p-8 font-inter bg-gray-50 min-h-screen">
            {/* Added Head component for responsive viewport meta tag */}
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 rounded-lg p-4 bg-white shadow-lg">
                Account Balances
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, TNAM address, or TPKNAM address..."
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-700"></div>
                    <p className="ml-4 text-gray-700 text-lg">Fetching current balances...</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider rounded-tl-lg">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">TPKNAM Address</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">TNAM Address</th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition duration-150 ease-in-out"
                                    onClick={() => handleSort('initialAllocation')}
                                >
                                    NAM Allocation (Initial)
                                    {renderSortArrow('initialAllocation')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider rounded-tr-lg cursor-pointer hover:bg-blue-200 transition duration-150 ease-in-out"
                                    onClick={() => handleSort('currentBalance')}
                                >
                                    Current NAM Balance
                                    {renderSortArrow('currentBalance')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedAndFilteredBalances.map((entry, index) => {
                                // Determine the color class for the current balance
                                let balanceTextColorClass = 'text-gray-800'; // Default black/dark gray

                                // Only apply color if currentBalance is a valid number and not 'Loading...' or 'N/A' or 'Error'
                                if (entry.currentBalance !== 'Loading...' && entry.currentBalance !== 'N/A' && entry.currentBalance !== 'Error') {
                                    const initialNum = parseFloat(entry.initialAllocation); // Already parsed to float
                                    const currentNum = parseFloat(entry.currentBalance);

                                    if (!isNaN(initialNum) && !isNaN(currentNum)) {
                                        if (currentNum < initialNum) {
                                            balanceTextColorClass = 'text-red-500'; // Current is lower
                                        } else if (currentNum >= initialNum) { // Current is same or higher
                                            balanceTextColorClass = 'text-green-500';
                                        }
                                    }
                                }

                                return (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-bl-lg">
                                            {entry.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                            {entry.tpknamAddress || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                            {entry.tnamAddress || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {/* Display formatted number for initial allocation */}
                                            {isNaN(entry.initialAllocation) ? 'N/A' : entry.initialAllocation.toLocaleString(undefined, { minimumFractionDigits: NAM_DECIMAL_PLACES, maximumFractionDigits: NAM_DECIMAL_PLACES })}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold rounded-br-lg ${balanceTextColorClass}`}>
                                            {entry.currentBalance}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <p className="mt-8 text-center text-gray-500 text-sm">
                Balances are fetched live from {INDEXER_BASE_URL} and may take a moment to load.
            </p>
        </div>
    );
}


