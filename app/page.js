"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head'; // Import Head for viewport meta tag

// --- Configuration ---
const NAM_DECIMAL_PLACES = 6;
const NAM_DENOM_FACTOR = 10 ** NAM_DECIMAL_PLACES;
const INDEXER_BASE_URL = 'https://indexer.namada.tududes.com/api/v1/account/';

// JSON data replacing the rawDataString and parseData function
const initialData = [
    { name: 'Daniel (Mandragora)', tnamAddress: 'tnam1qrmanuyyunsljx3jek6wzq3th2v4p6k2nvqsq9yu', initialAllocation: '1079930.75', currentBalance: 'Loading...' },
    { name: 'sirouk', tnamAddress: 'tnam1qq0t2s4dmqvxqwl25fm3eyckgekgftggfg9nfe5h', initialAllocation: '356490.16', currentBalance: 'Loading...' },
    { name: '0xGolden', tnamAddress: 'tnam1qqxrtxz2n6ek5thd9qdxhztrl58swrkkp55y7gyv', initialAllocation: '289400.28', currentBalance: 'Loading...' },
    { name: 'veight', tnamAddress: 'tnam1qrmt5f8qy8dkjattjdlsnfez8c3hnr6zev600stx', initialAllocation: '264271.63', currentBalance: 'Loading...' },
    { name: '!encipher', tnamAddress: 'tnam1qq58qdqn9ragnq9zk9cz8pz5spkrx3hf3yshu72k', initialAllocation: '234333.67', currentBalance: 'Loading...' },
    { name: 'ke1pie', tnamAddress: 'tnam1qp73a52vzpy279y3vj7wny0yukkmwaydhs4huulj', initialAllocation: '221949.69', currentBalance: 'Loading...' },
    { name: 'CryptoDruide | Crypto_Universe', tnamAddress: 'tnam1qp4n652cywawhw95nys7q99kmzzxl677svayxtc6', initialAllocation: '217861.78', currentBalance: 'Loading...' },
    { name: 'RuslanGL', tnamAddress: 'tnam1qp03tgvuhy9glsq7tjwtxd9tddq2ef8qsgt6gepw', initialAllocation: '171451.93', currentBalance: 'Loading...' },
    { name: 'Cryptopital', tnamAddress: 'tnam1qq4axm5ptj36tqy27e6qgc5tcfc5nx7lu5xgajap', initialAllocation: '165199.83', currentBalance: 'Loading...' },
    { name: 'cryptobtcbuyer', tnamAddress: 'tnam1qzpgcq8ymkxvq9j4jn6vcm64uf7znsywk55zwfvz', initialAllocation: '161111.91', currentBalance: 'Loading...' },
    { name: 'ixela', tnamAddress: 'tnam1qz0cz4c8smd7lsjxk86u32sfv8xdh3ehtcerm25q', initialAllocation: '153657.48', currentBalance: 'Loading...' },
    { name: 'anastese', tnamAddress: 'tnam1qpmt9f2caw8qnfr2zrwr229z3c76wcl32ynyzhd4', initialAllocation: '151853.99', currentBalance: 'Loading...' },
    { name: 'viboracecata', tnamAddress: 'tnam1qrzq7qz6u9clvkg2qp90slglemy96eqfyg4mhx4k', initialAllocation: '149569.57', currentBalance: 'Loading...' },
    { name: 'Nodes.Guru', tnamAddress: 'tnam1qr36j29ujmynjjj63c8269cghz60xtkxrct92tv7', initialAllocation: '138628.38', currentBalance: 'Loading...' },
    { name: 'CryptoSJnet', tnamAddress: 'tnam1qpj9aye7zd86pgfpjh2pnal3yjzrfkff2s6n5fq4', initialAllocation: '130933.49', currentBalance: 'Loading...' },
    { name: 'fego', tnamAddress: 'tnam1qpuqgcvesxhcyhh72vctdql3r6xqkdaxgqv5v3k9', initialAllocation: '119992.31', currentBalance: 'Loading...' },
    { name: 'amadison79', tnamAddress: 'tnam1qr3x6geajq4ghxctzsn02jaw8elu6m5005w2ve37', initialAllocation: '107367.86', currentBalance: 'Loading...' },
    { name: 'Anastalita', tnamAddress: 'tnam1qpa6e6cg6fpgtxd03f58m9v7yr27kjjw5vj3m36j', initialAllocation: '105804.84', currentBalance: 'Loading...' },
    { name: 'gnosed', tnamAddress: 'tnam1qq3ad0g88vzs7hwh3zkrxmah3jczt8uf5cazfslv', initialAllocation: '105804.84', currentBalance: 'Loading...' },
    { name: 'MADMAN', tnamAddress: 'tnam1qrm70x8ll8v0ccqthwdwvjctkhf9xaumzqu4uxhs', initialAllocation: '102919.25', currentBalance: 'Loading...' },
    { name: 'Minajuddin', tnamAddress: 'tnam1qznqfllstks3hc6d5wp50cnwds57s4wey5l804av', initialAllocation: '102197.86', currentBalance: 'Loading...' },
    { name: 'SATMan - 0xgen', tnamAddress: 'tnam1qz2r7354v4u6qpsk4r9xtuuw8q7e0537yyw3n7sm', initialAllocation: '100033.67', currentBalance: 'Loading...' },
    { name: 'lofingvv', tnamAddress: 'tnam1qp937naye9wykm62s5suvczp27efekl50vqhpega', initialAllocation: '97148.08', currentBalance: 'Loading...' },
    { name: '2pilot', tnamAddress: 'tnam1qzfza0lphfanmruw29ddr986nqpen47xpq5dcqsm', initialAllocation: '95464.82', currentBalance: 'Loading...' },
    { name: 'AK3 I Crouton Digital', tnamAddress: 'tnam1qpestjcsad9auyn76z76hj95yrk9ypgfh54tkl8n', initialAllocation: '94983.89', currentBalance: 'Loading...' },
    { name: 'jasondavies', tnamAddress: 'tnam1qzhqswwk00qkuw3lnvwhyczd5tksecln5gqe7f5x', initialAllocation: '90535.28', currentBalance: 'Loading...' },
    { name: 'SY.Lai | Staking-power', tnamAddress: 'tnam1qr0aa9m77lragese03wzcpu6ucdhfg2m55c9r29x', initialAllocation: '85004.57', currentBalance: 'Loading...' },
    { name: 'Max Power 🔋', tnamAddress: 'tnam1qqaj3tn696chpel8mhc5sxzm0z7vcajx3g42258n', initialAllocation: '80435.72', currentBalance: 'Loading...' },
    { name: 'ubongj', tnamAddress: 'tnam1qqervkqf9t9z2ys89vjqq3057se5je4fjsdf307j', initialAllocation: '78512.00', currentBalance: 'Loading...' },
    { name: 'rAdius', tnamAddress: 'tnam1qzt3lx80a5g0wc9c2kqkundm4qdt5v6ukygf5y02', initialAllocation: '77550.14', currentBalance: 'Loading...' },
    { name: 'SeptimA [NODER]TEAM', tnamAddress: 'tnam1qzp2yw3nvww7l6ffdjw7sz0fzw604cv6q5e86z8t', initialAllocation: '77429.90', currentBalance: 'Loading...' },
    { name: 'Maragung', tnamAddress: 'tnam1qq6jps6lncl0myfqh83t36u8vaal3qyvpggp3s36', initialAllocation: '76468.04', currentBalance: 'Loading...' },
    { name: 'newera3', tnamAddress: 'tnam1qr07dspzjm4d8elajwy7q9n46zmhwg2twq7gkxhx', initialAllocation: '75145.48', currentBalance: 'Loading...' },
    { name: 'Ben West', tnamAddress: 'tnam1qqyrnatjva7fnm2djvxtmkz6qxavwz00syfl3v3n', initialAllocation: '73943.15', currentBalance: 'Loading...' },
    { name: 'itrocket_net', tnamAddress: 'tnam1qphapum364zlzj0k0kr7fjma06gryy7zvq9pm3l5', initialAllocation: '73702.69', currentBalance: 'Loading...' },
    { name: 'tgogayi', tnamAddress: 'tnam1qq0ph5svjjspkaz2ntw49j2zq8855237qcfuupjt', initialAllocation: '71658.73', currentBalance: 'Loading...' },
    { name: '!mpp4tunru CaptainClogs', tnamAddress: 'tnam1qqr88h7x4tu7q24378x5ajzv8lcyxdn975e90qwq', initialAllocation: '71057.57', currentBalance: 'Loading...' },
    { name: 'Amirr', tnamAddress: 'tnam1qqd0635gwywt2zhteruk9t58yaltajulusw0kav4', initialAllocation: '69133.84', currentBalance: 'Loading...' },
    { name: 'Hoan Wu', tnamAddress: 'tnam1qzxns80af9xg76nemfauevvm9sjjeq4quykcrhts', initialAllocation: '65045.93', currentBalance: 'Loading...' },
    { name: 'tree888(biwin.bnb)', tnamAddress: 'tnam1qr3cgrzj8d2gzmqx93lty32qqc5ltxdnauxps34y', initialAllocation: '61919.88', currentBalance: 'Loading...' },
    { name: 'AnnaB', tnamAddress: 'tnam1qr86f7lkvdgne3amgw4apl7q68k99ppwag80gvy8', initialAllocation: '61559.18', currentBalance: 'Loading...' },
    { name: 'CrazyMoney', tnamAddress: 'tnam1qzhldhypqm52jg7qdygry4af07zs4y3vxymcqvmw', initialAllocation: '61078.25', currentBalance: 'Loading...' },
    { name: 'Duy Chu', tnamAddress: 'tnam1qqad3hwnp2uurajq2pxmqfz4l5qumnau8sr6e0x2', initialAllocation: '58914.06', currentBalance: 'Loading...' },
    { name: 'Boruto__', tnamAddress: 'tnam1qzdxkns9pucyh2sdmkxwpq5mahdh2yldvvvmkv3p', initialAllocation: '58673.59', currentBalance: 'Loading...' },
    { name: 'dismad', tnamAddress: 'tnam1qp9vzawjxd2h82exxyysyv63h5wgs5h6lsuqe4pw', initialAllocation: '58433.13', currentBalance: 'Loading...' },
    { name: 'anrd04', tnamAddress: 'tnam1qrlda6zaglrex3vz0llxh5rngk986mnwnqxtgjaj', initialAllocation: '58192.66', currentBalance: 'Loading...' },
    { name: 'shedy', tnamAddress: 'tnam1qqdchcj2l8v3ezcxa8c28sxwutfxnj04kqek62sr', initialAllocation: '58192.66', currentBalance: 'Loading...' },
    { name: 'Pathrock', tnamAddress: 'tnam1qpuqtudug2taurlljvhkwaqkunlv9rw0qqdrgw64', initialAllocation: '57471.26', currentBalance: 'Loading...' },
    { name: 'OriginStake', tnamAddress: 'tnam1qrjq5exq7ejw5p3yecjxuteru966xn2hq5huxr3r', initialAllocation: '56870.10', currentBalance: 'Loading...' },
    { name: 'Sourled', tnamAddress: 'tnam1qpu4z9jhd79sz2a2qcwu88s59046hww0eg0l49g7', initialAllocation: '56389.17', currentBalance: 'Loading...' },
    { name: 'Tecnodes', tnamAddress: 'tnam1qprq7uel08mkd2ec8q4yqsekdugf0qjhxskauggw', initialAllocation: '56268.94', currentBalance: 'Loading...' },
    { name: '.Alex', tnamAddress: 'tnam1qrnk87h0kwx6445k3yu3qj490sfvljfxn5ecmhve', initialAllocation: '56028.47', currentBalance: 'Loading...' },
    { name: 'Thuseven', tnamAddress: 'tnam1qpzzvw8z57suuupn6px7ad4a78lr99r3gyvmfa6r', initialAllocation: '55667.77', currentBalance: 'Loading...' },
    { name: 'Kamizake | Namada', tnamAddress: 'tnam1qpz29wx2adkdqulx237mcm6p6vzmyx7htudnxs74', initialAllocation: '55066.61', currentBalance: 'Loading...' },
    { name: '. Logosdibta', tnamAddress: 'tnam1qzpmzpzrcq3p90877psw9efk0wmf9gm2myt5v2sl', initialAllocation: '54224.98', currentBalance: 'Loading...' },
    { name: 'Agung_laksana', tnamAddress: 'tnam1qpytpjjfdeq2jkph8alwradf7cl6t7clsstdypp9', initialAllocation: '53623.82', currentBalance: 'Loading...' },
    { name: 'plsgiveup', tnamAddress: 'tnam1qpawc283w90rz0xg54r69mdf25h5d26tac47g3uq', initialAllocation: '52301.26', currentBalance: 'Loading...' },
    { name: 'KingSuper', tnamAddress: 'tnam1qpz93yrdr7d8g773lxj4h53c27kudz3ddvl9yd46', initialAllocation: '51219.16', currentBalance: 'Loading...' },
    { name: 'web34ever', tnamAddress: 'tnam1qqgxklf5aj7ttqrgt7tuj3hs2z7uxu8e0uw96sh9', initialAllocation: '51098.93', currentBalance: 'Loading...' },
    { name: 'cyberG', tnamAddress: 'tnam1qps7f03vx5fr2f4sk3q9z7my2l3p0j0lds3aart2', initialAllocation: '49535.90', currentBalance: 'Loading...' },
    { name: 'GV-SwissStaking', tnamAddress: 'tnam1qpctqz5ef7a7pzth8cphxhcvzsgfx2qngu4zmq5s', initialAllocation: '49295.44', currentBalance: 'Loading...' },
    { name: 'Cosmic Validator', tnamAddress: 'tnam1qzkzxmahynhs5p9j09hn65yg0q2h755vuuq39a4e', initialAllocation: '49175.20', currentBalance: 'Loading...' },
    { name: 'bosscrypto', tnamAddress: 'tnam1qqr4n35rj0tr2tcnd0kxhwmuplnjt7yncc85zhh2', initialAllocation: '48934.74', currentBalance: 'Loading...' },
    { name: 'Atalma', tnamAddress: 'tnam1qpccrrpcqf8qfyfz52w74h7v885dkt248cjpjse5', initialAllocation: '48814.50', currentBalance: 'Loading...' },
    { name: 'zoz', tnamAddress: 'tnam1qry7uxnzawcs425tjlxmllw276pr6c8qg5ytv07c', initialAllocation: '48213.34', currentBalance: 'Loading...' },
    { name: 'Lavender_FiveNodes', tnamAddress: 'tnam1qppww2y4kfg9p0xx4m730kaxnnwxtjc47c7v432v', initialAllocation: '47131.25', currentBalance: 'Loading...' },
    { name: 'ZecHub', tnamAddress: 'tnam1qqs5fuz88hhwyau86cr26u0hh4p6afu0lqwlhdqf', initialAllocation: '46530.08', currentBalance: 'Loading...' },
    { name: 'moodman-solution', tnamAddress: 'tnam1qz0sx92fevw4caq89j3hvp93p6epczcwwsvyc53q', initialAllocation: '46289.62', currentBalance: 'Loading...' },
    { name: 'PurpleMoney', tnamAddress: 'tnam1qze8w6y6v8a2qsa0xs7sh4tgfwzckh0slggyupd0', initialAllocation: '45928.92', currentBalance: 'Loading...' },
    { name: 'Kekeii', tnamAddress: 'tnam1qrfar8pkacu0pct6540yrpq8m46yz688ssf9rdq5', initialAllocation: '45688.45', currentBalance: 'Loading...' },
    { name: 'zerokn0wledge_', tnamAddress: 'tnam1qp5amhzzg94tsh9geqdn0e4u3prup5hamcgl2zvc', initialAllocation: '44606.36', currentBalance: 'Loading...' },
    { name: 'AAN | CDI', tnamAddress: 'tnam1qr6fxq4qttm4p0gd2e364rsmp64dvqg62yvmc67r', initialAllocation: '43524.26', currentBalance: 'Loading...' },
    { name: 'Fuji AR', tnamAddress: 'tnam1qpp2ajul3kgvxfxyy68w2vfya9ykpktfzgmpdvhm', initialAllocation: '43163.56', currentBalance: 'Loading...' },
    { name: 'ptzruslan', tnamAddress: 'tnam1qz4kqu495qne6ue0382v7hw2cmvcvew5wvk5v73k', initialAllocation: '41360.07', currentBalance: 'Loading...' },
    { name: 'silent666', tnamAddress: 'tnam1qp08xqts572xznned3whfv07vw2kacjzty5qc7xk', initialAllocation: '40879.14', currentBalance: 'Loading...' },
    { name: 'Arash', tnamAddress: 'tnam1qq4mfeeagxx6aqsl2mvs2clx7zcfhgenecg4yell', initialAllocation: '40638.68', currentBalance: 'Loading...' },
    { name: 'Nami077', tnamAddress: 'tnam1qzag0hanure9r7mzx688k6tx6jwfplme6gxtd4hr', initialAllocation: '40277.98', currentBalance: 'Loading...' },
    { name: 'rexslash', tnamAddress: 'tnam1qzteh6symphlg0yvfjmmk45ef83l0hxvrqd34j48', initialAllocation: '39917.28', currentBalance: 'Loading...' },
    { name: 'aliefaisala', tnamAddress: 'tnam1qp9slejdxvanu7mttqt8yyj07unxq4n0uv7292mr', initialAllocation: '39676.81', currentBalance: 'Loading...' },
    { name: 'tr0uva1lle', tnamAddress: 'tnam1qz4r8wur6rx20sx5kknktqatvh2zxujz3vk6pdp2', initialAllocation: '39676.81', currentBalance: 'Loading...' },
    { name: 'Alexander | P2P.org', tnamAddress: 'tnam1qp96jsc6d5dfs6hfu2yglvsagsdpmd0dwghsdmaq', initialAllocation: '38113.79', currentBalance: 'Loading...' },
    { name: '! .sipalingtestnet', tnamAddress: 'tnam1qzdtn3u539943gdlmwd7pjmrd960dw39cqha9lsv', initialAllocation: '38113.79', currentBalance: 'Loading...' },
    { name: 'Mehmedialem', tnamAddress: 'tnam1qpsj72pfjn5jzawzq8yrvdk79u76dwher5vdrpmf', initialAllocation: '37151.93', currentBalance: 'Loading...' },
    { name: 'oowwll', tnamAddress: 'tnam1qrw6dle45ld8acfryk0eaumezrfqge5gkctgjsaj', initialAllocation: '36911.46', currentBalance: 'Loading...' },
    { name: 'Brightlystake', tnamAddress: 'tnam1qqk3t289f5heaerrjvpxjh2exjp2lfw57sc0nslj', initialAllocation: '36550.76', currentBalance: 'Loading...' },
    { name: 'InCase', tnamAddress: 'tnam1qrc2fcehlyktz5w99hagvpalyazeu7wthqk4f5cp', initialAllocation: '35588.90', currentBalance: 'Loading...' },
    { name: 'egormajj', tnamAddress: 'tnam1qrm0my8cyv4mqn22ukx24y7xexzqxfk6mcnldqkd', initialAllocation: '35228.20', currentBalance: 'Loading...' },
    { name: 'cryptomolot', tnamAddress: 'tnam1qqa8l58hhj2mkswta50qe0cz2rtn5nrhxsfxzr5e', initialAllocation: '35107.97', currentBalance: 'Loading...' },
    { name: 'NickShakel', tnamAddress: 'tnam1qrczdnnzswpyfaf56q4899r5shrtljugq58f506l', initialAllocation: '35107.97', currentBalance: 'Loading...' },
    { name: 'Pansophic Chad', tnamAddress: 'tnam1qq4r7d0f97qlek0npp84vnnjlaeg6g5etyjcgjc5', initialAllocation: '34987.74', currentBalance: 'Loading...' },
    { name: 'sayin7', tnamAddress: 'tnam1qr47uerf9ae54sa2s9e782je06jyn8msmucycskh', initialAllocation: '34987.74', currentBalance: 'Loading...' },
    { name: 'shoni_crypto', tnamAddress: 'tnam1qrujxec7s4ut6ml29aau6t27ka5fv2qemszzpr22', initialAllocation: '33905.64', currentBalance: 'Loading...' },
    { name: 'niocrisnode', tnamAddress: 'tnam1qpq6g44x78uxh7yha9m7cnkenmw3mlnmhg9fkzne', initialAllocation: '33665.18', currentBalance: 'Loading...' },
    { name: 'kunyoung kim', tnamAddress: 'tnam1qpkeftsa6jhzdfalmxavw4njg7kz9qy7d5cyffs0', initialAllocation: '32823.55', currentBalance: 'Loading...' },
    { name: 'lovecity', tnamAddress: 'tnam1qr2wpxs9maznhjmalzqqf83wpqzq48dp6c2vx8rq', initialAllocation: '31981.92', currentBalance: 'Loading...' },
    { name: 'Wufangfang', tnamAddress: 'tnam1qqg35pa05tq9yvf2t7vauzvku7mknwe5w5jzs8ew', initialAllocation: '30899.82', currentBalance: 'Loading...' },
    { name: 'Beta', tnamAddress: 'tnam1qqy54murmd83htykfvp43ye4accpwyszd5fhm36c', initialAllocation: '30779.59', currentBalance: 'Loading...' },
    { name: 'Emzod', tnamAddress: 'tnam1qrngzd9drjyk4zmep2nzumt7ts4mxrswusd6eez7', initialAllocation: '30539.12', currentBalance: 'Loading...' },
    { name: 'romanv1812', tnamAddress: 'tnam1qqwdyzrjm00gutgl0rr3dn7tmnfwwaeycyxq7u73', initialAllocation: '30539.12', currentBalance: 'Loading...' },
    { name: 'ivanbro1', tnamAddress: 'tnam1qrvlqt8kwzdmr98j2avqdre66r9n0hjw0yxpr602', initialAllocation: '30298.66', currentBalance: 'Loading...' },
    { name: 'brsbtc', tnamAddress: 'tnam1qzyu9e9dr8w45lnp5g0j9tjs2s7v2knk2qgcmmrd', initialAllocation: '30178.43', currentBalance: 'Loading...' },
    { name: 'IONode Vietnam', tnamAddress: 'tnam1qpnypzzpc2hqvtvcvqzy5d5jj3u5g3q3wq9svqdz', initialAllocation: '29577.26', currentBalance: 'Loading...' },
    { name: 'Muxa1lo', tnamAddress: 'tnam1qztengpreuc6l3wfr0ks3k7wfgt6yrmyg5j7lhnh', initialAllocation: '29216.56', currentBalance: 'Loading...' },
    { name: 'tantalum666', tnamAddress: 'tnam1qpur87kyc8fcuq8mufg80ex96y9h8e9lfvg533kh', initialAllocation: '28615.40', currentBalance: 'Loading...' },
    { name: 'Vlad_', tnamAddress: 'tnam1qzsx0r69r6vngz9t6xsc2syhs7lranfpj5ums99z', initialAllocation: '28615.40', currentBalance: 'Loading...' },
    { name: 'POR | ContributionDAO', tnamAddress: 'tnam1qz7cdegfcyamm895eq0w9e8hspacnfm8rgg5at4c', initialAllocation: '28615.40', currentBalance: 'Loading...' },
    { name: 'freeds', tnamAddress: 'tnam1qrnfm55jgspanjxlmu4vlm25v5yv5lwuzy2dwqxz', initialAllocation: '28254.70', currentBalance: 'Loading...' },
    { name: 'STAKR.space', tnamAddress: 'tnam1qpvq6du2y9635p49kc2tjw55yx8k2d4caufp538z', initialAllocation: '28254.70', currentBalance: 'Loading...' },
    { name: 'seb160', tnamAddress: 'tnam1qpw2twd7ayeq7lq9c7ly5rmrcdfv89zrzqnwztn7', initialAllocation: '26932.14', currentBalance: 'Loading...' },
    { name: 'Daviduok', tnamAddress: 'tnam1qz5q2xmzk0w9ffymxzyrlfn8gw3h5xw32gryxqpw', initialAllocation: '26691.68', currentBalance: 'Loading...' },
    { name: 'Melody555', tnamAddress: 'tnam1qrzhx02d7tv56m9626t08yc25tsucz6s95z0gtrw', initialAllocation: '25850.05', currentBalance: 'Loading...' },
    { name: 'genue', tnamAddress: 'tnam1qzne0heq0lh7pugcxqvmvswahsahqnauty62te90', initialAllocation: '25248.88', currentBalance: 'Loading...' },
    { name: 'mdlog', tnamAddress: 'tnam1qpl8w4vjsh7vhh6ruf0qaer0ehx6yt8e95xldfmr', initialAllocation: '25128.65', currentBalance: 'Loading...' },
    { name: 'Namex', tnamAddress: 'tnam1qqxcke4uxl77jd0rapggam0yws864y45ggnztx9g', initialAllocation: '25008.42', currentBalance: 'Loading...' },
    { name: 'Zener', tnamAddress: 'tnam1qqf38cxavw8tt7l5y34zr4jln5ysmay5vc7cr5ze', initialAllocation: '24046.55', currentBalance: 'Loading...' },
    { name: 'garmien', tnamAddress: 'tnam1qqd0g8eeq67kta4rfwt25y5ahv9h2kxrgsz37ag7', initialAllocation: '23926.32', currentBalance: 'Loading...' },
    { name: 'Pablo@Pablo-Lema.com Address 1', tnamAddress: 'tnam1qqcvttrz8e9ej3cxnhdvz4g74mkrgt06w5faq98w', initialAllocation: '23806.09', currentBalance: 'Loading...' },
    { name: 'cryon', tnamAddress: 'tnam1qqj78m84le66kxr7l8lmmtxkq2huusvtnvfc5v8a', initialAllocation: '23685.86', currentBalance: 'Loading...' },
    { name: 'SerCry', tnamAddress: 'tnam1qzd5mqyn0fcezhxcll28duuvn7snqetv7mut80k3w', initialAllocation: '23445.39', currentBalance: 'Loading...' },
    { name: 'sam_wang1', tnamAddress: 'tnam1qz3t05lnpmm8lxjjrrg5k87mq3xn78vvq5nhu3zf', initialAllocation: '23204.92', currentBalance: 'Loading...' },
    { name: 'SelimC', tnamAddress: 'tnam1qpks9c28flkxwqpaqtm63snf2gcaw4gc7vdkthau', initialAllocation: '22964.46', currentBalance: 'Loading...' },
    { name: 'Levels | Nocturnal Labs', tnamAddress: 'tnam1qzlhpv900ps0js2xlqjr0rx7p6xs4w3nxc34cv0h', initialAllocation: '22483.53', currentBalance: 'Loading...' },
    { name: 'Brian Bitberi', tnamAddress: 'tnam1qrxlse6r56e97h285hfme38ytetlpg9hjq56xhrv', initialAllocation: '22363.30', currentBalance: 'Loading...' },
    { name: 'Badalister', tnamAddress: 'tnam1qp7ckftuftqsqu9e9przy89p02a58w8rputgvcah', initialAllocation: '22363.30', currentBalance: 'Loading...' },
    { name: 'tRDM', tnamAddress: 'tnam1qrw5ksvkde67yh5cq99k2da2sltjdcyahcqqejsp', initialAllocation: '21521.67', currentBalance: 'Loading...' },
    { name: 'Dered', tnamAddress: 'tnam1qqcn4ztxwk7sz5030ufnyghwedjg4r8vpv9v5e7h', initialAllocation: '21521.67', currentBalance: 'Loading...' },
    { name: 'Maria_G', tnamAddress: 'tnam1qzuufzw2q88tuxzkpag239g0vzy9y23d0yfpfnjx', initialAllocation: '20680.04', currentBalance: 'Loading...' },
    { name: 'Node Guardians', tnamAddress: 'tnam1qqd82j09mhux6rr6hkcap78ulcmrdnxchgluf4yw', initialAllocation: '20078.87', currentBalance: 'Loading...' },
    { name: 'Hitasyurek', tnamAddress: 'tnam1qqv89f8jlk47g22depen3nwfsmtp37f3lq5grv9m', initialAllocation: '19958.64', currentBalance: 'Loading...' },
    { name: 'Antoine', tnamAddress: '', initialAllocation: '19477.71', currentBalance: 'N/A' },
    { name: 'briandora', tnamAddress: '', initialAllocation: '19237.24', currentBalance: 'N/A' },
    { name: 'mrjw', tnamAddress: 'tnam1qp9czmscrkzndtr0p7kyhfh8cykjayg45uycxwah', initialAllocation: '18876.54', currentBalance: 'Loading...' },
    { name: 'keozz', tnamAddress: 'tnam1qqwrm0edpqm3lvqqc5lq625zh5uqdh2swcmdr95v', initialAllocation: '18515.85', currentBalance: 'Loading...' },
    { name: 'Firo', tnamAddress: 'tnam1qqxh4lgxpvrxn7yudgk3v8resfhcrhsnmg7um7kj', initialAllocation: '18275.38', currentBalance: 'Loading...' },
    { name: 'fef', tnamAddress: 'tnam1qq0mx83lu95657amjpsmz8tlhtp0e4lxhvsru8su', initialAllocation: '18155.15', currentBalance: 'Loading...' },
    { name: 'Astronomica', tnamAddress: 'tnam1qrep2wj59q9flrdj9xxmyy7dlmw3pzpdly0etdvr', initialAllocation: '17914.68', currentBalance: 'Loading...' },
    { name: 'hikicha0_0', tnamAddress: 'tnam1qrtczn3c0p8qsx4m7r2eu8je8kpeju7wsyx5pc4t', initialAllocation: '17914.68', currentBalance: 'Loading...' },
    { name: 'mztacat', tnamAddress: 'tnam1qz6uyk3eh44asmx6qscstykgvpayz2rk6chu4lm2', initialAllocation: '17313.52', currentBalance: 'Loading...' },
    { name: 'whiterose420', tnamAddress: '', initialAllocation: '17313.52', currentBalance: 'N/A' },
    { name: 'Gruberx', tnamAddress: 'tnam1qqcgdmzqqcgnxw4n7evhaurnrly9utdmlu5jwmwn', initialAllocation: '17313.52', currentBalance: 'Loading...' },
    { name: 'Vincagame', tnamAddress: 'tnam1qz9985v4wx4v743nzhsaurvkf2a8c7kuny4mwtt8', initialAllocation: '16592.12', currentBalance: 'Loading...' },
    { name: 'kuzey', tnamAddress: 'tnam1qqe7z8y40tpx5n2mdpg7dg40h8amj8n27gtzqkkh', initialAllocation: '15870.73', currentBalance: 'Loading...' },
    { name: 'buidlfren', tnamAddress: '', initialAllocation: '15870.73', currentBalance: 'N/A' },
    { name: 'du333', tnamAddress: 'tnam1qrfayzdmhnuemuv7nj3env8m2nftgzudyc26pv5j', initialAllocation: '15870.73', currentBalance: 'Loading...' },
    { name: 'Hypatia', tnamAddress: 'tnam1qpj0h58je2upsa2qs00tcnvhru5xmvtrws43fqjt', initialAllocation: '15750.49', currentBalance: 'Loading...' },
    { name: 'kriptoboss', tnamAddress: 'tnam1qqr4n35rj0tr2tcnd0kxhwmuplnjt7yncc85zhh2', initialAllocation: '15510.03', currentBalance: 'Loading...' },
    { name: 'Cryptobox', tnamAddress: 'tnam1qrhcnzgzmd5342hszzs06yxfyz63sptflq2djyhj', initialAllocation: '15389.79', currentBalance: 'Loading...' },
    { name: 'Oneplus', tnamAddress: 'tnam1qpfl7yxqyywcjgn38fwtzsur2dp4ktqqyspk29f7', initialAllocation: '15389.79', currentBalance: 'Loading...' },
    { name: 'skilly', tnamAddress: 'tnam1qqtuqxy7akeeea2e2sc3e9hy6p7vj947r5dmphuv', initialAllocation: '14908.86', currentBalance: 'Loading...' },
    { name: 'TraderOzy', tnamAddress: 'tnam1qrfnrdmdr7q0l9pnetsyc8mdec0waennfcyj8vl3', initialAllocation: '13225.60', currentBalance: 'Loading...' },
    { name: 'JUN_GALXE', tnamAddress: 'tnam1qrek3uzr0m7qnum6w9wkc40aurdtqq54xysyalxg', initialAllocation: '12864.91', currentBalance: 'Loading...' },
    { name: 'heejin lee', tnamAddress: 'tnam1qze5dz3fsh3jccanjvm3g0jfrhrx9t98k5auckcp', initialAllocation: '12504.21', currentBalance: 'Loading...' },
    { name: 'Essiraer', tnamAddress: 'tnam1qphk0jsvpwnrrespgpzf3xel3hhcw23c9g0mjstg', initialAllocation: '12383.98', currentBalance: 'Loading...' },
    { name: 'StraiK80097576', tnamAddress: 'tnam1qp6ep3h854ucc06p35d7hr0vx3nprft0zgjz8g6r', initialAllocation: '11903.04', currentBalance: 'Loading...' },
    { name: 'ghotoman', tnamAddress: 'tnam1qzx4gva6c47lq638h9tq8uhjvzqz9h2h3qhu7ps4', initialAllocation: '11181.65', currentBalance: 'Loading...' },
    { name: 'peachstake', tnamAddress: 'tnam1qpvpaj4q0a7n7dlhrpsraahn8p5g5cgvuu0e42gy', initialAllocation: '10941.18', currentBalance: 'Loading...' },
    { name: 'BLACK_W9', tnamAddress: 'tnam1qpks9c28flkxwqpaqtm63snf2gcaw4gc7vdkthau', initialAllocation: '10941.18', currentBalance: 'Loading...' },
    { name: 'NodeJom_', tnamAddress: 'tnam1qqu5ya9zda2cx56qclcllttznxm78szq75m5hrp2', initialAllocation: '10460.25', currentBalance: 'Loading...' },
    { name: 'jininja', tnamAddress: 'tnam1qrmmgupz5eelly3m2uf6kvt0pknqfl8kp59megef', initialAllocation: '9859.09', currentBalance: 'Loading...' },
    { name: 'sava', tnamAddress: 'tnam1qrm3ymz9mxuxygjx85qv22z3tchw6t8wdqlryf9q', initialAllocation: '8536.53', currentBalance: 'Loading...' },
    { name: 'ramonsami', tnamAddress: 'tnam1qqgycsaqvuez5d9a9p3kv8p4w0mj9jgxzqcwv242', initialAllocation: '8536.53', currentBalance: 'Loading...' },
    { name: 'Duc', tnamAddress: 'tnam1qpn0wjeh2fkkfjn6s5dtqlt6ufmhcup9cu979hsw', initialAllocation: '7815.13', currentBalance: 'Loading...' },
    { name: 'Kishan.Heerekar', tnamAddress: 'tnam1qq80294ayszwwy0gwuewp97gkr7ksw3txun9kxep', initialAllocation: '7334.20', currentBalance: 'Loading...' },
    { name: 'erkan | UniqNodes', tnamAddress: 'tnam1qqyklrx2d5rusqujqnfku5cjy26jghv5tu2zy8gg', initialAllocation: '7334.20', currentBalance: 'Loading...' },
    { name: 'Rysiman', tnamAddress: 'tnam1qrzkcqjkpx6gt776zzcerex6wa0xpvw5vg5jktmq', initialAllocation: '7213.97', currentBalance: 'Loading...' },
    { name: 'JeTrix', tnamAddress: 'tnam1qp937jjkmgkpaaplwnfp94r4reja2usa5v072lqz', initialAllocation: '6612.80', currentBalance: 'Loading...' },
    { name: 'mexonecrypto', tnamAddress: 'tnam1qrc0afpznwclva93vegt498kcd4cths7c5zvnvcu', initialAllocation: '6612.80', currentBalance: 'Loading...' },
    { name: 'Nazar Kk', tnamAddress: 'tnam1qq020c6la2zhdknuvn6exmmwdydj45a7fgfp44nf', initialAllocation: '5771.17', currentBalance: 'Loading...' },
    { name: 'nanana', tnamAddress: 'tnam1qqs2jwt4ha0mnd42pxf508s5z9pdm9gre5m4v2ly', initialAllocation: '5530.71', currentBalance: 'Loading...' },
    { name: 'Army IDs', tnamAddress: 'tnam1qq2x8hs7kunfy7v4gjnaxa5v6js3juakhs4fmq03', initialAllocation: '4568.85', currentBalance: 'Loading...' },
    { name: 'JuliusDecaliio', tnamAddress: '', initialAllocation: '4448.61', currentBalance: 'N/A' },
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
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term

    useEffect(() => {
        // Use the pre-parsed initialData directly
        setBalances(initialData);

        const fetchAllBalances = async () => {
            setLoading(true);
            setError(null);
            const updatedBalances = await Promise.all(
                initialData.map(async (entry) => { // Use initialData here
                    if (entry.tnamAddress && entry.tnamAddress !== 'N/A') { // Only fetch if tnamAddress exists and is not 'N/A'
                        const currentBalance = await getAccountBalanceFrontend(entry.tnamAddress);
                        return { ...entry, currentBalance };
                    }
                    return entry; // Return entry as is if no tnamAddress or 'N/A'
                })
            );
            setBalances(updatedBalances);
            setLoading(false);
        };

        fetchAllBalances();
    }, []); // Empty dependency array means this runs once on mount

    // Filtered balances based on search term
    const filteredBalances = balances.filter(entry => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            entry.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            (entry.tnamAddress && entry.tnamAddress.toLowerCase().includes(lowerCaseSearchTerm))
        );
    });

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
                    placeholder="Search by name or TNAM address..."
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">TNAM Address</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">NAM Allocation (Initial)</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider rounded-tr-lg">Current NAM Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBalances.map((entry, index) => {
                                // Determine the color class for the current balance
                                let balanceTextColorClass = 'text-gray-800'; // Default black/dark gray

                                // Only apply color if currentBalance is a valid number and not 'Loading...' or 'N/A' or 'Error'
                                if (entry.currentBalance !== 'Loading...' && entry.currentBalance !== 'N/A' && entry.currentBalance !== 'Error') {
                                    const initialNum = parseFloat(entry.initialAllocation);
                                    const currentNum = parseFloat(entry.currentBalance);

                                    if (!isNaN(initialNum) && !isNaN(currentNum)) {
                                        // Check for exactly 1 difference, considering floating point precision
                                        const difference = currentNum - initialNum;
                                        if (Math.abs(difference) > 0.999 && Math.abs(difference) < 1.001) { // Check if difference is approximately 1
                                            if (difference < 0) {
                                                balanceTextColorClass = 'text-red-500'; // Current is lower by 1
                                            } else if (difference > 0) {
                                                balanceTextColorClass = 'text-green-500'; // Current is higher by 1
                                            }
                                        }
                                    }
                                }

                                return (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-bl-lg">
                                            {entry.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                            {entry.tnamAddress || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {entry.initialAllocation}
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

