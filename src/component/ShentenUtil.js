// 작혼에서 받은 패를 코드 돌리기 위한 형태로 변경
export const convertPaiObjtoList = (hand, ming) => {
    let shoupai = {
        _bingpai: {
            m: [0,0,0,0,0,0,0,0,0,0],
            p: [0,0,0,0,0,0,0,0,0,0],
            s: [0,0,0,0,0,0,0,0,0,0],
            z: [0,0,0,0,0,0,0,0]
        },
        _allpai : {
            m: [0,0,0,0,0,0,0,0,0,0],
            p: [0,0,0,0,0,0,0,0,0,0],
            s: [0,0,0,0,0,0,0,0,0,0],
            z: [0,0,0,0,0,0,0,0]
        },
        _zimo: null,
        _fulou: [],
    }
    for (let i of hand) {
        if (i == hand[hand.length-1]) {
            shoupai._zimo = convertPaitoStr(i)
        }
        if (i.type == 1) {
            shoupai._bingpai.m[i.index] += 1
            shoupai._allpai.m[i.index] += 1
            if (i.dora == true) {
                shoupai._bingpai.m[0] += 1
                shoupai._allpai.m[0] += 1
            }
        } else if (i.type == 0) {
            shoupai._bingpai.p[i.index] += 1
            shoupai._allpai.p[i.index] += 1
            if (i.dora == true) {
                shoupai._bingpai.p[0] += 1
                shoupai._allpai.p[0] += 1
            }
        } else if (i.type == 2) {
            shoupai._bingpai.s[i.index] += 1
            shoupai._allpai.s[i.index] += 1
            if (i.dora == true) {
                shoupai._bingpai.s[0] += 1
                shoupai._allpai.s[0] += 1
            }
        } else {
            shoupai._bingpai.z[i.index] += 1
            shoupai._allpai.z[i.index] += 1
        }
    }
    
    for (let i of ming) {
        let str = ''
        i.pais.sort()
        let type = i.pais[0].type == 1? 'm' :i.pais[0].type == 0? 'p' : i.pais[0].type == 2? 's' : 'z'
        str += type
        for (let j of i.pais) {
                str += j.index
                if (j.dora == 0) {
                    shoupai._allpai[type][j.index]++
                } else {
                    shoupai._allpai[type][0]++
                }
        }
        str += '-'
        shoupai._fulou.push(str)
    }

    return shoupai
}

// 샹텐수 구하는 로직
export const xiangting = (shoupai) => {
    return Math.min(
        xiangting_yiban(shoupai),
        xiangting_guoshi(shoupai),
        xiangting_qidui(shoupai)
    );
}

// 버림패 배열 구하는 로직
export const findDiscardPai = (shoupai, shenten) => {
    let canDiscardPai = []
    let dapai = [];
    for (let i of ['m', 'p', 's', 'z']) {
        let bingpai = shoupai._bingpai[i];
        for (let j = 1; j < bingpai.length; j++) {
            if (bingpai[j] > 0) {
                if (j == 5) {
                    canDiscardPai.push(
                        bingpai[0] == 0 ?
                        [i, j]
                        : bingpai[j] > 1 ?
                        [i, j]
                        : [i, 0]
                    )
                    continue;
                }
                canDiscardPai.push([i, j])
            }
        }
    }

    for (let i of canDiscardPai) {
        let shoupai_discard = reducePai(shoupai, i[0], i[1]);
        if (xiangting(shoupai_discard) <= shenten) {
            dapai.push(i);
        }
        addPai(shoupai, i[0], i[1])
    }
    
    return dapai
}

// 요구패 구하는 로직
export const findYoukouPai = (shoupai, shenten) => {
    let youkouPai = [];
    for (let i in shoupai._bingpai) {
        let bingpai = shoupai._bingpai[i];
        for (let j = 1; j < bingpai.length; j++) {
            if (shoupai._bingpai[i][j] >= 4) continue;
            shoupai._bingpai[i][j]++
            if (xiangting(shoupai) < shenten) {
                youkouPai.push([i, j])
            }
            shoupai._bingpai[i][j]--
        }
    }
    return youkouPai
} 

// 화료역, 판수 부수 구하는 로직
export const hule = (shoupai, rongpai, param) => {
    let max = {
        ron : {
            hupai : [],
            fu : 0,
            fanshu : 0,
            damanguan:  0,
            score: [0]
        },
        zumo : {
            hupai : [],
            fu : 0,
            fanshu : 0,
            damanguan:  0,
            score: [0]
        }
    }

    let pre_hupai = get_pre_hupai(param.hupai);
    let post_hupai = findDora(shoupai, param.baopai);

    for (let isZumo in [true, false]) {
        for (var mianzi1 of hule_mianzi(shoupai, rongpai, isZumo)) {
            /* 面子構成を調べ、符を計算する */
            var hudi  = get_hudi(mianzi1, param.zhuangfeng, param.menfeng, isZumo);
            /* 手役の一覧を求める */
            var hupai = get_hupai(mianzi1, hudi, pre_hupai);
            
            if (hupai.length == 0) continue;
            //점수계산
            var fu = hudi.fu;
            var fanshu = 0, defen = 0, damanguan = 0;

            if (hupai[0].fanshu[0] == '*') {       // 役満の場合
                for (var h of hupai) {    // 複合する役満すべてについて以下を行う
                    damanguan += h.fanshu.match(/\*/g).length; // 役満複合数を加算
                }
                defen = 8000 * damanguan;
            } else {                                 // 役満以外の場合
                hupai = hupai.concat(post_hupai);  // 懸賞役を加える
                for (var h of hupai) { fanshu += h.fanshu }  // 翻数を決定する
                /* 基本点を求める */
                if      (fanshu >= 13) defen = 8000;  // 役満
                else if (fanshu >= 11) defen = 6000;  // 三倍満
                else if (fanshu >=  8) defen = 4000;  // 倍満
                else if (fanshu >=  6) defen = 3000;  // 跳満
                else {
                    defen = fu * 2 * 2;               // 符を4倍する (場ゾロ)
                    for (var i = 0; i < fanshu; i++) { defen *= 2 }
                                                    // 翻数分だけ2倍する
                    if (defen >= 2000) defen = 2000;  // 2000点を上限とする(満貫)
                }
            }

            var changbang = param.jicun.changbang;    // 積み棒
            var lizhibang = param.jicun.lizhibang;    // 立直棒

            if (isZumo == false) {    // ロン和了
                defen = Math.ceil(defen * (param.menfeng == 0 ? 6 : 4) / 100) * 100;
                defen = [defen + changbang * 300 + lizhibang * 1000, [defen]];
            } else { // ツモ和了
                defen = [Math.ceil(defen * 2 / 100) * 100, Math.ceil(defen / 100) * 100];  // 親の負担額, 子の負担額

                if (param.menfeng == 0) {  // 親の和了の場合
                    defen = [defen[0] * 3 + changbang * 300 + lizhibang * 1000, [defen[0] + changbang * 100 + ' All']]; // ALl
                } else {                 // 子の和了の場合
                    defen = [defen[0] + defen[1]*2 + changbang * 300 + lizhibang * 1000, [defen[0], defen[1]]]
                }
            }
            if (isZumo == false) {
                if (max.ron.score[0] < defen[0]){
                    max.ron = {
                        hupai : hupai,
                        fu : fu,
                        fanshu : fanshu,
                        damanguan:  damanguan,
                        score: defen
                    }
                }
            } else {
                if (max.zumo.score[0] < defen[0]){
                    max.zumo = {
                        hupai : hupai,
                        fu : fu,
                        fanshu : fanshu,
                        damanguan:  damanguan,
                        score: defen
                    }
                }
            }
        }
    }
    return max
}

//

export const addPai = (shoupai, type, idx) => {
    shoupai._bingpai[type][idx]++
    if (idx == 0) {
        shoupai._bingpai[type][5]++
    }
    return shoupai
}

export const reducePai = (shoupai, type, idx) => {
    shoupai._bingpai[type][idx]--
    if (idx == 0) {
        shoupai._bingpai[type][5]--
    }
    return shoupai
}

const convertPaitoStr = (pai) => {
    const type = pai.type == 1? 'm' : pai.type == 0? 'p' : pai.type == 2? 's' : 'z'
    const str = type + pai.index;

    return str
}

const findDora = (shoupai, dora) => {
    let post_hupai = [];
    let num = 0;
    if (dora) {
        dora.forEach(({dora, index, type}) => {
            if (index == shoupai._bingpai[type==1?'m':type==0?'p':type==2?'s':'z'].length-1) {
                if (type == 1) {
                    num += shoupai._allpai['m'][1]
                } else if (type == 0) {
                    num += shoupai._allpai['p'][1]
                } else if (type == 2) {
                    num += shoupai._allpai['s'][1]
                } else {
                    num += shoupai._allpai['z'][1]
                }
            } else {
                if (type == 1) {
                    num += shoupai._allpai['m'][index + 1]
                } else if (type == 0) {
                    num += shoupai._allpai['p'][index + 1]
                } else if (type == 2) {
                    num += shoupai._allpai['s'][index + 1]
                } else {
                    num += shoupai._allpai['z'][index + 1]
                }
            }
        })
    }
    for (let i of ['m', 'p', 's', 'z']) {
        const bingpai = shoupai._allpai[i];
        if (bingpai[0] != 0) {
            num++
        }
    }
    post_hupai.push({ name: '도라', fanshu: num })
    return post_hupai
}

export const getOwnFu = (playerIndex, kyouku) => {
    return Math.abs(playerIndex- kyouku)
}

function _xiangting(m, d, g, j) {
    let n = j ? 4 : 5;
    if (m         > 4) { d += m     - 4; m = 4         }
    if (m + d     > 4) { g += m + d - 4; d = 4 - m     }
    if (m + d + g > n) {                 g = n - m - d }
    if (j) d++;
    return 13 - m * 3 - d * 2 - g;
}

function dazi(bingpai) {
    let n_pai = 0, n_dazi = 0, n_guli = 0;

    for (let n = 1; n <= 9; n++) {
        n_pai += bingpai[n];
        if (n <= 7 && bingpai[n+1] == 0 && bingpai[n+2] == 0) {
            n_dazi += n_pai >> 1;
            n_guli += n_pai  % 2;
            n_pai = 0;
        }
    }
    n_dazi += n_pai >> 1;
    n_guli += n_pai  % 2;

    return { a: [ 0, n_dazi, n_guli ],
            b: [ 0, n_dazi, n_guli ] };
}

function shen_mianzi(bingpai, n = 1) {
    if (n > 9) return dazi(bingpai);

    let max = shen_mianzi(bingpai, n+1);

    if (n <= 7 && bingpai[n] > 0 && bingpai[n+1] > 0 && bingpai[n+2] > 0) {
        bingpai[n]--; bingpai[n+1]--; bingpai[n+2]--;
        let r = shen_mianzi(bingpai, n);
        bingpai[n]++; bingpai[n+1]++; bingpai[n+2]++;
        r.a[0]++; r.b[0]++;
        if (r.a[0]* 2 + r.a[1] > max.a[0]* 2 + max.a[1]) max.a = r.a;
        if (r.b[0]*10 + r.b[1] > max.b[0]*10 + max.b[1]) max.b = r.b;
    }

    if (bingpai[n] >= 3) {
        bingpai[n] -= 3;
        let r = shen_mianzi(bingpai, n);
        bingpai[n] += 3;
        r.a[0]++; r.b[0]++;
        if (r.a[0]* 2 + r.a[1] > max.a[0]* 2 + max.a[1]) max.a = r.a;
        if (r.b[0]*10 + r.b[1] > max.b[0]*10 + max.b[1]) max.b = r.b;
    }

    return max;
}

function shen_mianzi_all(shoupai, jiangpai) {
    let r = {
        m: shen_mianzi(shoupai._bingpai.m),
        p: shen_mianzi(shoupai._bingpai.p),
        s: shen_mianzi(shoupai._bingpai.s),
    };

    let z = [0, 0, 0];
    for (let n = 1; n <= 7; n++) {
        if      (shoupai._bingpai.z[n] >= 3) z[0]++;
        else if (shoupai._bingpai.z[n] == 2) z[1]++;
        else if (shoupai._bingpai.z[n] == 1) z[2]++;
    }

    let n_fulou = shoupai._fulou.length;

    let min = 13;

    for (let m of [r.m.a, r.m.b]) {
        for (let p of [r.p.a, r.p.b]) {
            for (let s of [r.s.a, r.s.b]) {
                let x = [n_fulou, 0, 0];
                for (let i = 0; i < 3; i++) {
                    x[i] += m[i] + p[i] + s[i] + z[i];
                }
                let n_xiangting = _xiangting(x[0], x[1], x[2], jiangpai);
                if (n_xiangting < min) min = n_xiangting;
            }
        }
    }

    return min;
}

function xiangting_yiban(shoupai) {
    let min = shen_mianzi_all(shoupai);

    for (let s of ['m','p','s','z']) {
        let bingpai = shoupai._bingpai[s];
        for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] >= 2) {
                bingpai[n] -= 2;
                let n_xiangting = shen_mianzi_all(shoupai, true);
                bingpai[n] += 2;
                if (n_xiangting < min) min = n_xiangting;
            }
        }
    }
    if (min == -1 && shoupai._zimo && shoupai._zimo.length > 2) return 0;

    return min;
}

function xiangting_guoshi(shoupai) {
    if (shoupai._fulou.length) return Infinity;

    let n_yaojiu = 0;
    let n_duizi  = 0;

    for (let s of ['m','p','s','z']) {
        let bingpai = shoupai._bingpai[s];
        let nn = (s == 'z') ? [1,2,3,4,5,6,7] : [1,9];
        for (let n of nn) {
            if (bingpai[n] >= 1) n_yaojiu++;
            if (bingpai[n] >= 2) n_duizi++;
        }
    }

    return n_duizi ? 12 - n_yaojiu : 13 - n_yaojiu;
}

function xiangting_qidui(shoupai) {
    if (shoupai._fulou.length) return Infinity;

    let n_duizi = 0;
    let n_guli  = 0;

    for (let s of ['m','p','s','z']) {
        let bingpai = shoupai._bingpai[s];
        for (let n = 1; n < bingpai.length; n++) {
            if      (bingpai[n] >= 2) n_duizi++;
            else if (bingpai[n] == 1) n_guli++;
        }
    }

    if (n_duizi          > 7) n_duizi = 7;
    if (n_duizi + n_guli > 7) n_guli  = 7 - n_duizi;

    return 13 - n_duizi * 2 - n_guli;
}

function hule_mianzi(shoupai, rongpai, isZumo) {

    let hulepai = isZumo==true? rongpai + '_' : rongpai +'+';
    hulepai = hulepai.replace(/0/, '5');
    
    return [].concat(hule_mianzi_yiban(shoupai, hulepai))    // 4面子1雀頭形
             .concat(hule_mianzi_qiduizi(shoupai, hulepai))  // 七対子形
             .concat(hule_mianzi_guoshi(shoupai, hulepai))   // 国士無双形
             .concat(hule_mianzi_jiulian(shoupai, hulepai)); // 九蓮宝燈形
}

function hule_mianzi_qiduizi(shoupai, hulepai) {

    var mianzi = [];
    
    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            if (bingpai[n] == 0) continue;
            if (bingpai[n] == 2) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai[2] + '!'
                            : s+n+n;
                mianzi.push(p);
            }
            else return [];  // 対子でないものがあった場合、和了形でない。
        }
    }

    return (mianzi.length == 7) ? [mianzi] : [];
}

function hule_mianzi_guoshi(shoupai, hulepai) {

    var mianzi = [];

    if (shoupai._fulou.length > 0) return mianzi;
    
    var you_duizi = false;
    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        var nn = (s == 'z') ? [1,2,3,4,5,6,7] : [1,9];
        for (var n of nn) {
            if (bingpai[n] == 2) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai[2] + '!'
                            : s+n+n;
                mianzi.unshift(p);
                you_duizi = true;
            }
            else if (bingpai[n] == 1) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n + hulepai[2] + '!'
                            : s+n;
                mianzi.push(p);
            }
            else return [];  // 足りない幺九牌があった場合、和了形でない。
        }
    }

    return you_duizi ? [mianzi] : [];
}

function hule_mianzi_jiulian(shoupai, hulepai) {

    var s = hulepai[0];
    if (! s.match(/^[mps]$/)) return [];
    
    var mianzi = s;
    var bingpai = shoupai._bingpai[s];
    for (var n = 1; n <= 9; n++) {
        if ((n == 1 || n == 9) && bingpai[n] < 3) return [];
                                   // 1と9が3枚そろっていない場合、和了形でない
        if (bingpai[n] == 0) return []; // 足りない数牌がある場合、和了形でない
        var nn = (n == hulepai[1]) ? bingpai[n] - 1 : bingpai[n];
        for (var i = 0; i < nn; i++) {
            mianzi += n;
        }
    }
    mianzi += hulepai.substr(1) + '!';

    return [[mianzi]];
}

function hule_mianzi_yiban(shoupai, hulepai) {

    var hule_mianzi = [];
    
    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            if (bingpai[n] < 2) continue;
            bingpai[n] -= 2;       // 2枚以上ある牌を雀頭候補として抜き取る
            var jiangpai = s+n+n;
            for (var mm of mianzi_all(shoupai)) { // 残りの牌で面子構成を求める
                mm.unshift(jiangpai);             // 面子構成に雀頭を差し込む
                if (mm.length != 5) continue;
                hule_mianzi = hule_mianzi.concat(add_hulepai(mm, hulepai));
                                                  // 和了牌のマークをつける
            }
            bingpai[n] += 2;
        }
    }
    
    return hule_mianzi;
}

function mianzi_all(shoupai) {

    var all_mianzi = [[]];
    
    /* 萬子、筒子、索子の副露していない牌から面子を探す */
    for (var s of ['m','p','s']) {
        var new_mianzi = [];
        var sub_mianzi = mianzi(s, shoupai._bingpai[s], 1);
                                                 // 色ごとに mianzi() を呼出す
        for (var mm of all_mianzi) {
            for (var nn of sub_mianzi) {
                new_mianzi.push(mm.concat(nn));  // 結果をマージする
            }
        }
        all_mianzi = new_mianzi;
    }
    
    /* 字牌の面子は刻子しかあり得ないので自前で処理する */
    var sub_mianzi_z = [];
    for (var n = 1; n <= 7; n++) {
        if (shoupai._bingpai.z[n] == 0) continue;
        if (shoupai._bingpai.z[n] != 3) return [];
        sub_mianzi_z.push('z'+n+n+n);
    }
    
    /* 副露済みの面子を後方に追加する */
    var fulou = shoupai._fulou.map(function(m){return m.replace(/0/g ,'5')});
    for (var i = 0; i < all_mianzi.length; i++) {
        all_mianzi[i] = all_mianzi[i].concat(sub_mianzi_z)
                                    .concat(fulou);
    }
    
    return all_mianzi;
}

function mianzi(s, bingpai, n) {

    if (n > 9) return [[]];
    
    /* 面子を抜き取り終わったら、次の位置に進む */
    if (bingpai[n] == 0) return mianzi(s, bingpai, n+1);
    
    /* 順子を抜き取る */
    var shunzi = [];
    if (n <= 7 && bingpai[n] > 0 && bingpai[n+1] > 0 && bingpai[n+2] > 0) {
        bingpai[n]--; bingpai[n+1]--; bingpai[n+2]--;
        shunzi = mianzi(s, bingpai, n);  // 抜き取ったら同じ位置でもう一度試行
        bingpai[n]++; bingpai[n+1]++; bingpai[n+2]++;
        for (var s_mianzi of shunzi) {
            s_mianzi.unshift(s+(n)+(n+1)+(n+2));
        }
    }
    
    /* 刻子を抜き取る */
    var kezi = [];
    if (bingpai[n] >= 3) {
        bingpai[n] -= 3;
        kezi = mianzi(s, bingpai, n);    // 抜き取ったら同じ位置でもう一度試行
        bingpai[n] += 3;
        for (var k_mianzi of kezi) {
            k_mianzi.unshift(s+n+n+n);
        }
    }
    
    return shunzi.concat(kezi);  // 順子と刻子の結果をマージして返す
}

function add_hulepai(hule_mianzi, p) {

    var regexp   = new RegExp('^(' + p[0] + '.*' + (p[1] || '5') +')');
    var replacer = '$1' + p[2] + '!';
    
    var new_mianzi = [];
    
    for (var i = 0; i < hule_mianzi.length; i++) {
        if (hule_mianzi[i].match(/[\-\+\=]/)) continue;
        if (i > 0 && hule_mianzi[i] == hule_mianzi[i-1]) continue;
        var m = hule_mianzi[i].replace(regexp, replacer);
        if (m == hule_mianzi[i]) continue;
        var tmp_mianzi = hule_mianzi.concat();
        tmp_mianzi[i] = m;
        new_mianzi.push(tmp_mianzi);
    }
    
    return new_mianzi;
}

function get_hudi(mianzi, zhuangfeng, menfeng, isZumo) {

    /* 面子構成のチェックに使う正規表現 */
    var zhuangfengpai = new RegExp('^z' + (zhuangfeng + 1) + '.*$');  // 場風
    var menfengpai    = new RegExp('^z' + (menfeng + 1) + '.*$');     // 自風
    var sanyuanpai    = /^z[567].*$/;                                 // 三元牌
    
    var yaojiu        = /^.*[z19].*$/;                 // 幺九牌
    var zipai         = /^z.*$/;                       // 字牌
    
    var kezi          = /^[mpsz](\d)\1\1.*$/;          // 刻子(槓子を含む)
    var ankezi        = /^[mpsz](\d)\1\1(?:\1|_\!)?$/; // 暗刻子(暗槓子を含む)
    var gangzi        = /^[mpsz](\d)\1\1.*\1.*$/;      // 槓子
    
    var danqi         = /^[mpsz](\d)\1[\-\+\=\_]\!$/;               // 単騎待ち
    var kanzhang      = /^[mps]\d\d[\-\+\=\_]\!\d$/;                // 嵌張待ち
    var bianzhang     = /^[mps](123[\-\+\=\_]\!|7[\-\+\=\_]\!89)$/; // 辺張待ち

    /* 返り値の初期値を設定する */
    var hudi = {
        fu:         20,          // 符計算の結果
        menqian:    true,        // 門前の場合 true
        zimo:       true,        // ツモ和了の場合 true
        shunzi:     { m: {}, p: {}, s: {} },         // 順子の面子構成
        kezi:       { m: [0,0,0,0,0,0,0,0,0,0],
                      p: [0,0,0,0,0,0,0,0,0,0],
                      s: [0,0,0,0,0,0,0,0,0,0],
                      z: [0,0,0,0,0,0,0,0]      },   // 刻子の面子構成
        n_shunzi:   0,           // 順子の数
        n_kezi:     0,           // 刻子の数(槓子を含む)
        n_ankezi:   0,           // 暗刻子の数(暗槓子を含む)
        n_gangzi:   0,           // 槓子の数
        n_zipai:    0,           // 字牌面子の数(雀頭を含む)
        n_yaojiu:   0,           // 幺九牌入り面子の数(雀頭を含む)
        danqi:      false,       // 単騎待ちの場合 true
        pinghu:     false,       // 平和の場合 true
        zhuangfeng: zhuangfeng,  // 場風(0: 東、1: 南、2: 西、3: 北)
        menfeng:    menfeng      // 自風(0: 東、1: 南、2: 西、3: 北)
    };
    
    for (var m of mianzi) {    // 和了形の各面子について以下の処理を行う
        if (isZumo == false)            hudi.zimo = false;
                                               // ロン和了の場合 false を設定
        if (m.match(/[\-\+\=](?!\!)/))  hudi.menqian = false;
                                               // 副露している場合 false を設定
        
        if (m.match(yaojiu))            hudi.n_yaojiu++;
                                               // 幺九牌を含む場合その数を1加算
        if (m.match(zipai))             hudi.n_zipai++;
                                               // 字牌を含む場合その数を1加算

        if (m.match(danqi))             hudi.danqi = true;
                                               // 単騎待ちの場合 true を設定
        
        if (mianzi.length != 5) continue;
                                // 4面子1雀頭形でない場合は以下の処理はスキップ
        
        if (m == mianzi[0]) {              // 雀頭の処理
            var fu = 0;                           // 雀頭の符を 0 で初期化
            if (m.match(zhuangfengpai)) fu += 2;  // 場風の場合2符加符
            if (m.match(menfengpai))    fu += 2;  // 自風の場合2符加符
            if (m.match(sanyuanpai))    fu += 2;  // 三元牌の場合2符加符
            hudi.fu += fu;                        // 雀頭の符を加える
            if (hudi.danqi)             hudi.fu += 2; // 単騎待ちの場合2符加符
        }
        else if (m.match(kezi)) {          // 刻子の処理 
            hudi.n_kezi++;                    // 刻子の数を1加算
            var fu = 2;                       // 刻子の符を 2 で初期化
            if (m.match(yaojiu)) { fu *= 2;                  }
                                              // 幺九牌の場合2倍する
            if (m.match(ankezi)) { fu *= 2; hudi.n_ankezi++; }
                                              // 暗刻子の場合2倍しその数を1加算
            if (m.match(gangzi)) { fu *= 4; hudi.n_gangzi++; }
                                              // 槓子の場合4倍しその数を1加算
            hudi.fu += fu;                    // 刻子の符を加える

            /* 刻子の構成を記録 */
            hudi.kezi[m[0]][m[1]] = 1;
        }
        else {                             // 順子の処理
            hudi.n_shunzi++;                        // 順子の数を1加算
            if (m.match(kanzhang))  hudi.fu += 2;   // 嵌張待ちの場合2符加符
            if (m.match(bianzhang)) hudi.fu += 2;   // 辺張待ちの場合2符加符

            /* 順子の構成を記録 */
            var nnn = m.replace(/[^\d]/g, '');
            if (! hudi.shunzi[m[0]][nnn])   hudi.shunzi[m[0]][nnn] = 1;
            else                            hudi.shunzi[m[0]][nnn]++;
        }
    }
    
    if (mianzi.length == 7) {        // 七対子形の場合
        hudi.fu = 25;                    // 符は25符固定
    }
    else if (mianzi.length == 5) {   // 4面子1雀頭形の場合
        hudi.pinghu = (hudi.menqian && hudi.fu == 20); // 門前で20符なら平和
        if (hudi.zimo) {                           // ツモ和了の場合
            if (! hudi.pinghu)      hudi.fu +=  2;     // 平和でなければ2符加符
        }
        else {                                     // ロン和了の場合
            if (hudi.menqian)       hudi.fu += 10;     // 門前なら10符加符
            else if (hudi.fu == 20) hudi.fu  = 30;     // 喰い平和は30符固定
        }
        hudi.fu = Math.ceil(hudi.fu / 10) * 10;  // 10点未満は切り上げ
    }
    
    return hudi;
}

function get_hupai(mianzi, hudi, pre_hupai) {

    /**** 役を判定する関数は個別に説明する ****/

    /* 役満の初期値を設定する。状況役に役満(天和、地和)が含まれている場合は
       それを設定、ない場合は空配列で初期化。                               */
    var damanguan = (pre_hupai.length > 0 && pre_hupai[0].fanshu[0] == '*')
                        ? pre_hupai : [];

    /* 判定できた役満を追加していく */
    damanguan = damanguan
                .concat(guoshiwushuang(mianzi, hudi))
                .concat(sianke(mianzi, hudi))
                .concat(dasanyuan(mianzi, hudi))
                .concat(sixihu(mianzi, hudi))
                .concat(ziyise(mianzi, hudi))
                .concat(lvyise(mianzi, hudi))
                .concat(qinglaotou(mianzi, hudi))
                .concat(sigangzi(mianzi, hudi))
                .concat(jiulianbaodeng(mianzi, hudi));

    if (damanguan.length > 0) return damanguan;  // 役満がある場合は処理終了
    else return pre_hupai                        // 役満がない場合は状況役に
                .concat(menqianqing(mianzi, hudi))           // 役を追加していく
                .concat(fanpai(mianzi, hudi))
                .concat(pinghu(mianzi, hudi))
                .concat(duanyaojiu(mianzi, hudi))
                .concat(yibeikou(mianzi, hudi))
                .concat(sansetongshun(mianzi, hudi))
                .concat(yiqitongguan(mianzi, hudi))
                .concat(hunquandaiyaojiu(mianzi, hudi))
                .concat(qiduizi(mianzi, hudi))
                .concat(duiduihu(mianzi, hudi))
                .concat(sananke(mianzi, hudi))
                .concat(sangangzi(mianzi, hudi))
                .concat(sansetongke(mianzi, hudi))
                .concat(hunlaotou(mianzi, hudi))
                .concat(xiaosanyuan(mianzi, hudi))
                .concat(hunyise(mianzi, hudi))
                .concat(chunquandaiyaojiu(mianzi, hudi))
                .concat(erbeikou(mianzi, hudi))
                .concat(qingyise(mianzi, hudi));
}

function get_pre_hupai(hupai) {

    let pre_hupai = [];

    if (hupai.lizhi == 1)   pre_hupai.push({ name: '리치', fanshu: 1 });
    if (hupai.lizhi == 2)   pre_hupai.push({ name: '더블리치', fanshu: 2 });

    return pre_hupai;
}

function menqianqing(mianzi, hudi) {
    if (hudi.menqian && hudi.zimo)
            return [{ name: '멘젠쯔모', fanshu: 1 }];
    return [];
}

function fanpai(mianzi, hudi) {
    var feng_hanzi = ['東','南','西','北'];
    var fanpai_all = [];
    if (hudi.kezi.z[hudi.zhuangfeng+1])
            fanpai_all.push({ name: '장풍 ' + feng_hanzi[hudi.zhuangfeng],
                              fanshu: 1 });
    if (hudi.kezi.z[hudi.menfeng+1])
            fanpai_all.push({ name: '자풍 ' + feng_hanzi[hudi.menfeng],
                              fanshu: 1 });
    if (hudi.kezi.z[5]) fanpai_all.push({ name: '역패 백', fanshu: 1 });
    if (hudi.kezi.z[6]) fanpai_all.push({ name: '역패 발', fanshu: 1 });
    if (hudi.kezi.z[7]) fanpai_all.push({ name: '역패 중', fanshu: 1 });
    return fanpai_all;
}

function pinghu(mianzi, hudi) {
    if (hudi.pinghu)        return [{ name: '핑후', fanshu: 1 }];
    return [];
}

function duanyaojiu(mianzi, hudi) {
    if (hudi.n_yaojiu == 0) return [{ name: '탕야오', fanshu: 1 }];
    return [];
}

function yibeikou(mianzi, hudi) {
    if (! hudi.menqian)     return [];
    var beikou = 0;
    for (var s in hudi.shunzi) {
        for (var m in hudi.shunzi[s]) {
            if (hudi.shunzi[s][m] > 3) beikou++;
            if (hudi.shunzi[s][m] > 1) beikou++;
        }
    }
    if (beikou == 1)        return [{ name: '이페코', fanshu: 1 }];
    return [];
}

function sansetongshun(mianzi, hudi) {
    var shunzi = hudi.shunzi;
    for (var m in shunzi.m) {
        if (shunzi.p[m] && shunzi.s[m])
            return [{ name: '삼색동순', fanshu: (hudi.menqian ? 2 : 1) }];
    }
    return [];
}

function yiqitongguan(mianzi, hudi) {
    var shunzi = hudi.shunzi;
    for (var s in shunzi) {
        if (shunzi[s][123] && shunzi[s][456] && shunzi[s][789])
            return [{ name: '일기통관', fanshu: (hudi.menqian ? 2 : 1) }];
    }
    return [];
}

function hunquandaiyaojiu(mianzi, hudi) {
    if (hudi.n_yaojiu == 5 && hudi.n_shunzi > 0 && hudi.n_zipai > 0)
            return [{ name: '혼전대요구', fanshu: (hudi.menqian ? 2 : 1) }];
    return [];
}

function qiduizi(mianzi, hudi) {
    if (mianzi.length == 7)     return [{ name: '치또이', fanshu: 2 }];
    return [];
}

function duiduihu(mianzi, hudi) {
    if (hudi.n_kezi == 4)       return [{ name: '또이또이', fanshu: 2 }];
    return [];
}

function sananke(mianzi, hudi) {
    if (hudi.n_ankezi == 3)     return [{ name: '삼암각', fanshu: 2 }];
    return [];
}

function sangangzi(mianzi, hudi) {
    if (hudi.n_gangzi == 3)     return [{ name: '삼깡즈', fanshu: 2 }];
    return [];
}

function sansetongke(mianzi, hudi) {
    var kezi = hudi.kezi;
    for (var n = 1; n <= 9; n++) {
        if (kezi.m[n] + kezi.p[n] + kezi.s[n] == 3)
                                return [{ name: '삼색동각', fanshu: 2 }];
    }
    return [];
}

function hunlaotou(mianzi, hudi) {
    if (hudi.n_yaojiu == mianzi.length
        && hudi.n_shunzi == 0 && hudi.n_zipai > 0)
                                return [{ name: '혼노두', fanshu: 2 }];
    return [];
}

function xiaosanyuan(mianzi, hudi) {
    if (hudi.kezi.z[5] + hudi.kezi.z[6] + hudi.kezi.z[7] == 2
        && mianzi[0].match(/^z[567]/))
                                return [{ name: '소삼원', fanshu: 2 }];
    return [];
}

function hunyise(mianzi, hudi) {
    for (var s of ['m','p','s']) {
        var yise = new RegExp('^[z' + s + '].*$');
        if (mianzi.filter(function(m){return m.match(yise)}).length
                    == mianzi.length
            &&  hudi.n_zipai > 0)
                return [{ name: '혼일색', fanshu: (hudi.menqian ? 3 : 2) }];
    }
    return [];
}

function chunquandaiyaojiu(mianzi, hudi) {
    if (hudi.n_yaojiu == 5 && hudi.n_shunzi > 0 && hudi.n_zipai == 0)
            return [{ name: '순전대요구', fanshu: (hudi.menqian ? 3 : 2) }];
    return [];
}

function erbeikou(mianzi, hudi) {
    if (! hudi.menqian)     return [];
    var beikou = 0;
    for (var s in hudi.shunzi) {
        for (var m in hudi.shunzi[s]) {
            if (hudi.shunzi[s][m] > 3) beikou++;
            if (hudi.shunzi[s][m] > 1) beikou++;
        }
    }
    if (beikou == 2)        return [{ name: '량페커', fanshu: 3 }];
    return [];
}

function qingyise(mianzi, hudi) {
    for (var s of ['m','p','s']) {
        var yise = new RegExp('^[z' + s + '].*$');
        if (mianzi.filter(function(m){return m.match(yise)}).length
                    == mianzi.length
            &&  hudi.n_zipai == 0)
                return [{ name: '청일색', fanshu: (hudi.menqian ? 6 : 5) }];
    }
    return [];
}

function guoshiwushuang(mianzi, hudi) {
    if (mianzi.length != 13)    return [];
    if (hudi.danqi)     return [{ name: '국사무쌍 13면대기', fanshu: '**' }];
    else                return [{ name: '국사무쌍', fanshu: '*' }];
}

function sianke(mianzi, hudi) {
    if (hudi.n_ankezi != 4)     return [];
    if (hudi.danqi)     return [{ name: '사암각 단기', fanshu: '**' }];
    else                return [{ name: '사암각', fanshu: '*' }];
}

function dasanyuan(mianzi, hudi) {
    if (hudi.kezi.z[5] + hudi.kezi.z[6] + hudi.kezi.z[7] == 3) {
        var bao_mianzi = mianzi.filter(function(m){
                    return m.match(/^z([567])\1\1(?:[\-\+\=]|\1)(?!\!)/)});
        var baojia = (bao_mianzi[2] && bao_mianzi[2].match(/[\-\+\=]/));
        return [{ name: '대삼원', fanshu: '*', baojia: baojia && baojia[0] }];
    }
    return [];
}

function sixihu(mianzi, hudi) {
    var kezi = hudi.kezi;
    if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 4) {
        var bao_mianzi = mianzi.filter(function(m){
                    return m.match(/^z([1234])\1\1(?:[\-\+\=]|\1)(?!\!)/)});
        var baojia = (bao_mianzi[3] && bao_mianzi[3].match(/[\-\+\=]/));
        return [{ name: '대사희', fanshu: '**', baojia: baojia && baojia[0] }];
    }
    if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 3
        && mianzi[0].match(/^z[1234]/))
                        return [{ name: '소사희', fanshu: '*' }];
    return [];
}

function ziyise(mianzi, hudi) {
    if (hudi.n_zipai == mianzi.length)
                        return [{ name: '자일색', fanshu: '*' }];
    return [];
}

function lvyise(mianzi, hudi) {
    if (mianzi.filter(function(m){return m.match(/^[mp]/)}).length > 0)
                                        return [];
    if (mianzi.filter(function(m){return m.match(/^z[^6]/)}).length > 0)
                                        return [];
    if (mianzi.filter(function(m){return m.match(/^s.*[1579]/)}).length > 0)
                                        return [];
    return [{ name: '녹일색', fanshu: '*' }];
}

function qinglaotou(mianzi, hudi) {
    if (hudi.n_kezi == 4 && hudi.n_yaojiu == 5 && hudi.n_zipai == 0)
                        return [{ name: '청노두', fanshu: '*' }];
    return [];
}

function sigangzi(mianzi, hudi) {
    if (hudi.n_gangzi == 4)
                        return [{ name: '사깡즈', fanshu: '*' }];
    return [];
}

function jiulianbaodeng(mianzi, hudi) {
    if (mianzi.length != 1)             return [];
    if (mianzi[0].match(/^[mps]1112345678999/))
                        return [{ name: '순정구련보등', fanshu: '**' }];
    else                return [{ name: '구련보등', fanshu: '*' }];
}