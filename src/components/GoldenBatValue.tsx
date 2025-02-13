'use client'  

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TrendingUp } from 'lucide-react';

const GoldenBatValue = () => {
  // 기본 상수
  const GOLD_WEIGHT_KG = 162;
  const GOLD_WEIGHT_G = GOLD_WEIGHT_KG * 1000;
  const START_YEAR = 2005;
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS_PASSED = CURRENT_YEAR - START_YEAR;
  const INITIAL_VALUE = 2700000000; // 27억원

  // 상태 관리
  const [currentGoldPrice, setCurrentGoldPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
      const fetchGoldPrice = async () => {
        try {
          const response = await fetch('https://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo?serviceKey=29w1mKji5S91PPngyzFuMXIOkeSzB5%2BQngk3qB6QNqte4pCKV54v%2BdH7xV15yxOK8ZijDTp2OCsT5tPucq9luQ%3D%3D&');
          const text = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");
          
          const firstItem = xmlDoc.querySelector('item');
          if (firstItem) {
            const pricePerKg = parseFloat(firstItem.querySelector('clpr')?.textContent || '0');
            const baseDate = firstItem.querySelector('basDt')?.textContent || '';
            
            // Format date from YYYYMMDD to YYYY.MM.DD
            const formattedDate = `${baseDate.slice(0, 4)}.${baseDate.slice(4, 6)}.${baseDate.slice(6, 8)}`;
            
            setCurrentGoldPrice(pricePerKg); // This is price per kg
            setLastUpdated(formattedDate);
            setLoading(false);
          } else {
            throw new Error('No gold price data available');
          }
        } catch (err) {
          setError('금시세를 불러오는데 실패했습니다');
          setLoading(false);
        }
      };
  
      fetchGoldPrice();
    }, []);

  // 현재 가치 계산
  const calculateCurrentValue = () => {
    if (!currentGoldPrice) return null;
    return GOLD_WEIGHT_KG * currentGoldPrice * 1000; // Convert to won
  };

  const currentValue = calculateCurrentValue();
  const valueIncrease = currentValue ? currentValue / INITIAL_VALUE : 0;
  const cagr = currentValue ? (Math.pow(valueIncrease, 1/YEARS_PASSED) - 1) * 100 : 0;

  return (
    <div className="w-full max-w-4xl p-6 space-y-8">
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">함평 황금박쥐 조형물</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 이미지 홀더 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                이미지 1 (전면)
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                이미지 2 (측면)
              </div>
            </div>
          </div>

          {/* 조형물 정보 */}
          <div className="space-y-4">
            <div className="p-4 bg-white/80 rounded-lg shadow-sm">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">조형물 의의</h3>
                  <p className="text-sm text-gray-600">1999년 함평군 대동면에서 발견된 162마리의 황금박쥐를 기념하여 {START_YEAR}년 제작</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900">규격</h3>
                <p className="text-sm text-gray-600">가로 1.5m</p>
                <p className="text-sm text-gray-600">세로 90cm</p>
                <p className="text-sm text-gray-600">높이 2.18m</p>
              </div>

              <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900">소재</h3>
                <p className="text-sm text-gray-600">순금 {GOLD_WEIGHT_KG}kg</p>
                <p className="text-sm text-gray-600">4마리의 황금박쥐가 원형 고리 안에 엇갈려 배치</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 가치 비교 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">투자금 대비 현재 가치</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-8 space-y-8">
          {loading ? (
            <div className="text-center text-gray-500">금시세를 불러오는 중...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              {/* SVG 차트 */}
              <div className="relative w-full max-w-2xl h-64">
                <svg viewBox="0 0 800 200" className="w-full">
                  {/* 시작 금액 원 */}
                  <g transform="translate(200, 100)">
                    <circle cx="0" cy="0" r="60" fill="url(#initialGradient)" className="drop-shadow-md"/>
                    <text x="0" y="0" textAnchor="middle" className="text-2xl font-bold" fill="#1f2937">
                      {(INITIAL_VALUE / 100000000).toFixed(0)}억
                    </text>
                    <text x="0" y="25" textAnchor="middle" className="text-sm" fill="#4b5563">
                      {START_YEAR}년
                    </text>
                  </g>

                  {/* 화살표 */}
                  <g transform="translate(350, 100)">
                    <path d="M0,0 L100,0" stroke="#9333ea" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                    <text x="50" y="-15" textAnchor="middle" className="text-sm" fill="#9333ea">
                      {valueIncrease.toFixed(1)}배 증가
                    </text>
                  </g>

                  {/* 현재 가치 원 */}
                  <g transform="translate(600, 100)">
                    <circle cx="0" cy="0" r="90" fill="url(#currentGradient)" className="drop-shadow-md"/>
                    <text x="0" y="0" textAnchor="middle" className="text-2xl font-bold" fill="#1f2937">
                      {currentValue ? (currentValue / 100000000).toFixed(0) : '?'}억
                    </text>
                    <text x="0" y="25" textAnchor="middle" className="text-sm" fill="#4b5563">
                      {CURRENT_YEAR}년
                    </text>
                  </g>

                  {/* Gradients & Markers */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#9333ea"/>
                    </marker>
                    <radialGradient id="initialGradient">
                      <stop offset="0%" stopColor="#fef3c7"/>
                      <stop offset="100%" stopColor="#fcd34d"/>
                    </radialGradient>
                    <radialGradient id="currentGradient">
                      <stop offset="0%" stopColor="#fef3c7"/>
                      <stop offset="100%" stopColor="#f59e0b"/>
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* 통계 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-900 mb-1">연평균 수익률 (CAGR)</h3>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-purple-600"/>
                    <span className="text-lg font-bold text-purple-900">{cagr.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">현재 금 시세</h3>
                  <p className="text-lg font-bold text-amber-900">
                    {currentGoldPrice ? `${currentGoldPrice.toLocaleString()}원/g` : '로딩중...'}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-emerald-900 mb-1">순금 {GOLD_WEIGHT_KG}kg 현재 가치</h3>
                  <p className="text-lg font-bold text-emerald-900">
                    {currentValue ? `${(currentValue / 100000000).toFixed(1)}억원` : '로딩중...'}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500 text-center">
        * 현재 가치는 금시세 기준 추정치입니다. ({CURRENT_YEAR}년 기준)
        <br />
        * 금시세 출처: 한국거래소(KRX)
      </div>
    </div>
  );
};

export default GoldenBatValue;
