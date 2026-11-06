import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const data = name => JSON.parse(readFileSync(`content/${name}.json`, 'utf8'));
const site = data('site');
const projects = data('projects');
const writing = data('writing');
const sections = [
  ['about','About','关于我','网络与新媒体本科在读 · 内容创作者 · 现代诗写作者'],
  ['projects','Projects','项目与实践','记录正在尝试的问题、方法和阶段。'],
  ['writing','Writing','写作与表达','我以橒墨为笔名写现代诗，也用随笔和阅读笔记保存那些值得回看的问题。'],
  ['now','Now','此刻','我现在把时间花在哪里。'],
  ['timeline','Timeline','成长时间线','记录已经发生的事和下一步计划。'],
  ['contact','Contact','联系','关于 AI 实践、内容创作和写作的交流。'],
];
const categories = {Poetry:'现代诗', Essays:'随笔与思考', Notes:'阅读笔记'};
const output = resolve('docs');
rmSync(output, {recursive:true, force:true});
mkdirSync(join(output,'assets'), {recursive:true});
cpSync('public/media', join(output,'media'), {recursive:true});
for (const name of ['motion.js','icon.svg']) cpSync(`src/${name}`,join(output,'assets',name));
cpSync('src/compiled.css',join(output,'assets/styles.css'));
writeFileSync(join(output,'.nojekyll'),'');
const artwork = readFileSync('src/plate.svg','utf8');

function Header({base, active}) {
  return <header className="top"><div className="wrap">
    <a className="brand" href={base || './'}><span aria-hidden="true">M</span>{site.name}</a>
    <nav className="nav" aria-label="主导航">{sections.map(([id,en]) =>
      <a key={id} href={`${base}${id}/`} aria-current={active===id?'page':undefined} lang="en">{en}</a>)}</nav>
  </div></header>;
}
function Page({title, description, active, base, sample, children}) {
  const pageTitle = title ? `${title} | ${site.name}` : `${site.name} | Personal Index`;
  return <html lang="zh-CN"><head><meta charSet="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>{pageTitle}</title><meta name="description" content={description}/>
    <meta property="og:title" content={pageTitle}/><meta property="og:description" content={description}/>
    <meta name="theme-color" content="#f8f8f6"/>{sample && <meta name="robots" content="noindex"/>}
    <link rel="icon" href={base+'assets/icon.svg'}/><link rel="stylesheet" href={base+'assets/styles.css'}/>
    <script defer src={base+'assets/motion.js'}/>
  </head><body>
    <a className="skip" href="#main">跳至正文</a><Header base={base} active={active}/>
    <main id="main" className="wrap" tabIndex={-1}>{children}</main>
    <footer><div className="wrap"><span>{site.name} · Personal Index</span><span lang="en">{site.tagline}</span></div></footer>
  </body></html>;
}
function Heading({label,title,description}) {
  return <div className="heading"><div className="kicker">{label}</div><h1>{title}</h1><p>{description}</p></div>;
}
function Home() {
  const nameParts = site.name.split(' ');
  return <>
    <section className="hero"><div className="hero-copy">
      <div className="kicker" lang="en">PERSONAL INDEX / VOL. 01</div>
      <h1>{nameParts[0]} <span>{nameParts.slice(1).join(' ')}</span></h1>
      <div className="topics" lang="en">AI · Global Business · Writing · Life</div>
      <p className="tagline" lang="en">{site.tagline}</p><p className="intro">{site.intro}</p>
      <div className="actions">
        <a className="button primary" href="projects/" lang="en">Explore My Work <span aria-hidden="true">↗</span></a>
        <a className="button" href="about/" lang="en">About Me <span aria-hidden="true">→</span></a>
      </div>
    </div><figure className="plate"><div className="min-h-0 flex-1" dangerouslySetInnerHTML={{__html:artwork}}/>
      <figcaption lang="en"><span>FIG. 01</span><span>ORBITS OF CURIOSITY</span></figcaption>
    </figure></section>
    <section className="index" aria-labelledby="index-title">
      <h2 className="kicker" id="index-title">THE INDEX / 档案目录</h2>
      <div className="index-grid">{sections.map(([id,,cn], i) =>
        <a className="index-link" key={id} href={id+'/'}><span className="index-no">0{i+1}</span><span>{cn}</span><Arrow/></a>)}</div>
    </section>
  </>;
}
const Arrow = () => <span aria-hidden="true">↗</span>;
const Paragraphs = ({items}) => items.map((item,index) => <p key={index}>{item}</p>);
const Status = ({value}) => value && <span className="status">{value}</span>;
const DateStamp = ({date}) => date && <time dateTime={date}>{date}</time>;
const safeLink = url => /^(https?:\/\/|mailto:)/i.test(url) ? url : undefined;
function Cover({item, base, index}) {
  return <div className="cover">{item.cover ?
    <img src={base+item.cover} alt={item.coverAlt} loading="lazy"/> : <span aria-hidden="true">0{index+1}</span>}</div>;
}
function About() {
  return <section className="section about"><div><div className="portrait">{site.photo ?
    <img src={'../'+site.photo} alt={site.photoAlt}/> : <strong aria-hidden="true">M.</strong>}</div>
    {!site.photo && <p className="portrait-caption">个人照片待补充</p>}</div>
    <div><h2>{site.name} / {site.penName}</h2><Paragraphs items={site.bio}/>
    <h2>我关注的方向</h2><ul className="list-disc pl-5">{site.interests.map(item => <li key={item} lang="en">{item}</li>)}</ul>
    <h2>我看重什么</h2><p>{site.values}</p>
    <a className="button mt-4" href="../timeline/">查看成长时间线 <span aria-hidden="true">→</span></a></div>
  </section>;
}
function Projects() {
  return <section className="section grid" aria-label="项目列表">{projects.map((item,index) =>
    <a className="card" data-reveal key={item.slug} href={item.slug+'/'}>
      <Cover item={item} index={index} base="../"/><div className="card-text">
        <div className="meta" lang="en">{item.category}</div><h2>{item.title}</h2><p>{item.summary}</p><Status value={item.status}/>
      </div>
    </a>)}</section>;
}
function Writing() {
  return <div className="section">{Object.entries(categories).map(([en,cn]) => {
    const entries = writing.filter(item => item.category === en);
    return <section className="category" key={en}><h2><span lang="en">{en}</span> / {cn}</h2>
      {entries.length ? entries.map(item => <a className="row" key={item.slug} href={item.slug+'/'}>
        <span className="index-no"><DateStamp date={item.date}/></span><div><strong>{item.title}</strong>
          <p>{item.summary}{item.sample && ' · 排版示例'}</p></div><Arrow/>
      </a>) : <p>待更新。</p>}
    </section>;
  })}</div>;
}
function Now() {
  return <div className="section prose grid gap-8">{site.now.map(([en,cn,body]) =>
    <section data-reveal key={en}><div className="meta" lang="en">{en}</div><h2>{cn}</h2><p>{body}</p></section>)}</div>;
}
function Timeline() {
  return <div className="section"><ol className="timeline">{site.timeline.map(([when,title,body,state]) =>
    <li data-reveal key={title}><div className="meta">{when}</div><h2>{title}</h2><p>{body}</p><Status value={state}/></li>)}</ol></div>;
}
function Contact() {
  return <div className="section contact-line">{Object.entries(site.contacts).map(([name,url]) =>
    safeLink(url) ? <a className="row" key={name} href={safeLink(url)}><strong>{name}</strong><Arrow/></a> :
    <div className="row" key={name}><strong>{name}</strong><span className="secondary">待补充</span></div>)}</div>;
}
function ProjectDetail({item,index}) {
  return <article className="section prose"><a className="back" href="../">← 所有项目</a>
    <Cover item={item} index={index} base="../../"/>
    <div className="meta flex flex-wrap items-center gap-3 py-3"><Status value={item.status}/><DateStamp date={item.date}/>{item.tools.join(' · ')}</div>
    <Paragraphs items={item.body}/>
    {safeLink(item.url) && <a className="button mt-4" href={safeLink(item.url)}>打开相关链接 <Arrow/></a>}
  </article>;
}
function WritingDetail({item}) {
  return <article className={'section prose'+(item.category==='Poetry'?' poem':'')}>
    <a className="back" href="../">← 写作目录</a>
    <div className="meta"><DateStamp date={item.date}/>{item.sample ? ' · 排版示例' : item.category === 'Poetry' ? ' · '+site.penName : ' · '+site.name}</div>
    {item.sample && <p className="secondary">本站排版示例，供替换为正式作品。</p>}
    <Paragraphs items={item.body}/>
  </article>;
}
function save(path, properties, content) {
  const target = join(output,...path);
  mkdirSync(target,{recursive:true});
  const document = <Page base={'../'.repeat(path.length)} {...properties}>{content}</Page>;
  writeFileSync(join(target,'index.html'),'<!doctype html>\n'+renderToStaticMarkup(document));
}
const contents = [About,Projects,Writing,Now,Timeline,Contact];
save([], {description:site.intro}, <Home/>);
sections.forEach(([id,en,title,description],index) => {
  const Section = contents[index];
  save([id],{title,description,active:id},<>
    <Heading label={`0${index+1} / ${en.toUpperCase()}`} title={title} description={description}/><Section/>
  </>);
});
projects.forEach((item,index) => save(['projects',item.slug], {title:item.title, description:item.summary, active:'projects'}, <>
  <Heading label={item.category} title={item.title} description={item.summary}/><ProjectDetail item={item} index={index}/>
</>));
writing.forEach(item => save(['writing',item.slug], {title:item.title, description:item.summary, active:'writing', sample:item.sample}, <>
  <Heading label={`${item.category} / ${categories[item.category]}`} title={item.title} description={item.summary}/><WritingDetail item={item}/>
</>));
