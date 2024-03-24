// Content.jsx
import React from 'react';

function Content() {
	return (
		<div className="home-content">
			<section id="intro">
				<h1>はじめに</h1>
				<p>このアプリケーションは、提出されたプログラムの採点の効率化を目指してTAが作成したものです。使用は義務ではなく、使用していないことによる減点は行いませんが、採点結果を早く公開するためにもなるべく協力しもらえるとスムーズになります。</p>
				<p>今年度から使用を開始しており、バグが含まれることも予想されるため、発見した場合は報告してください。使い方についてわからないことがある場合も気軽に質問してください。</p>
				<p>質問は<a href="mailto:dsa-ta@kde.cs.tsukuba.ac.jp">メール</a>でも可能です。</p>
			</section>
			
			<section id="grading">
				<h1>プログラムの採点について</h1>
				<p>プログラムの採点は、以下の2点を確認します。</p>
				<ol>
					<li>提出された関数ファイルとmainファイルが正しくコンパイル・実行できるか。</li>
					<li>提出された関数ファイルは正しく実装されているか。</li>
				</ol>
				<p>1については、提出されたmakefileによりmakeを使用してコンパイルができるかを確認後実行し、結果が正しいかを判定します。</p>
				<p>2については、TAがあらかじめ用意したテスト用プログラムと提出された関数ファイルを一緒にコンパイルし、複数のテストケースでの実行を行うことで全ての実行で結果が正しいかを判定します。</p>
				<p>さらに、これらの項目と同時に提出物が揃っているか、レポートの体裁は整っているか等を確認し点数をつけます。</p>
			</section>

			<section id="application-purpose">
				<h1>アプリケーションの目的</h1>
				<p>このアプリケーションは、主にファイル名や関数、出力のフォーマットチェックを行うために使用します。</p>
				<h3>ファイル名について</h3>
				<p>ファイル名は講義資料に記載のものに揃えてください。講義資料に記載がない場合、このアプリケーションの提出画面にファイル名が記載されているため、それに従ってください。これは、テスト用プログラムと提出された関数ファイルをmakeする際のコマンドを統一し、採点時のコンパイルを自動化するためです。</p>
				<h3>関数について</h3>
				<p>関数は、名前や引数の数、型などを講義資料に記載のものに揃えてください。指定の関数でない場合、コンパイルや実行時にエラーになる可能性があります。特に引数の数や型が異なる場合、課題の指示とは異なるため原点になる場合もあります。</p>
				<h3>出力フォーマットについて</h3>
				<p>出力フォーマットは講義資料に記載のものに揃えてください。講義資料に記載がない場合、このアプリケーションの提出画面に想定している出力フォーマットが乗っているので、それに則ってください。これは、実行結果の正誤判定に文字列の完全一致を利用しているためです。よくあるフォーマットのズレとしては例えば以下があります：</p>
				<ul>
				<li>カンマ区切りとスペース区切り: 求めている出力は半角スペース区切りのものであるが、提出されたプログラムのprintではカンマ区切りになっている。</li>
				<li>大文字と小文字: 求めている出力は大文字のアルファベットであるが、提出されたプログラムのprintでは小文字になっている。</li>
				</ul>
			</section>

			<section id="usage-flow">
				<h1>利用時の流れ</h1>
				<ol>
				<li>サイドバーから取り組む回を選択。</li>
				<li>プルダウンでどの課題をチェックするか選択。</li>
				<li>提出すべきファイル名を確認し、それをアップロード後提出。</li>
				<li>提出結果を確認。OKであればそれを含むソースコード一式、レポートをmanabaから提出。NGである場合、何がNGであるかを確認して修正後再度アップロードして提出。</li>
				</ol>
			</section>
			
			<section id="result">
				<h1>結果の見方</h1>
				<ul>
				<li>ok: フォーマットに問題はありません。そのプログラムを含む必要ファイルをmanabaから提出してください。</li>
				<li>file name error: ファイル名が正しくありません。提出する課題と提出ページが一致しているかを確認し、ファイル名を指定されたものに修正してください。</li>
				<li>function error: 関数名が正しくない、関数が存在しないなど関数に関するエラーです。講義資料を再度確認し、指示された関数の名前や引数の数、型などを見直してください。</li>
				<li>format error: 出力が正しくありません。これは出力のフォーマットが正しくない場合に加え、そもそも実行結果が誤っている場合もあります。まずは結果が正しいかを確認し、誤っている場合は実装を見直してください。結果が正しい場合は、区切り文字などが正しいかを確認してください。</li>
				</ul>
			</section>
		</div>
	);
}

export default Content;
