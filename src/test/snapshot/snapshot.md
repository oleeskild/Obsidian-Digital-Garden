IMAGES: 
A Assets/travolta.png
,A Assets/travolta.webp
,A Assets/unused_image.png
==========
0 QA hell/Break links + transclusions.md
==========
---
{"dg-publish":true,"permalink":"/0-qa-hell/break-links-transclusions/"}
---

Link with whitespace after link part: 
[[Empty file \| hehe this one breaks for real]]

Whitespace and bar in name: 

<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">

<div class="markdown-embed-title">

# whitespace.

</div>




</div></div>


Random hashes in transclusion title: 

<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">

<div class="markdown-embed-title">

## ## i think i fixed this one ## earlier #lol

</div>




</div></div>


This is a header ref which doesn't exist: 

<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">





This is above the header
## Header

This should be in this header block

## Another header

This shouldn't be under a header transclusion



Cheese 

</div></div>



This is a header transclusion that is slightly that uses a special character in the header


<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">



## Header

This should be in this header block


</div></div>



==========
000 Home.md
==========
---
{"dg-publish":true,"permalink":"/000-home/","tags":["gardenEntry"]}
---

## Welcome

Welcome to the digital garden testing vault! 

This vault is part of the `obsidian-digital-garden` repository, and meant to act as a staging area for 

1. providing a maintainable testing ground for the digital garden features
2. documenting features in action 

Hopefully in the future it can be part of automated testing too! Say, snapshot testing the output from this garden would actually be relatively easy! :) 

> [!info] See README for instructions on adding info to .env for testing


## Snapshot tests

This test vault enables snapshot testing of the garden compilation! To generate the snapshot: 

- run `Generate Garden Snapshot` from the command palette
- Snapshot generation is also run on plugin load. 


## Plugins 

This garden should have the following plugins 

- [x] [[P Plugins/PE Excalidraw/PE1 Transcluded excalidraw\|PE1 Transcluded excalidraw]]
- [x] [[P Plugins/PD Dataview/PD1 Dataview\|PD1 Dataview]]
- [x] hot reload (reloads obsidian dev plugins on changes)
==========
001 Links.md
==========
---
{"dg-publish":true,"permalink":"/001-links/"}
---

[[002 Hidden page\|002 Hidden page]]

[[003 Non published page\|003 Non published page]]

[[000 Home\| Aliased link to home]]

[[000 Home \| Link containing whitespace which works in obsidian but doesn't in garden :) - yes, this could be a ticket but lo and behold]]


==========
002 Hidden page.md
==========
---
{"dg-publish":true,"permalink":"/002-hidden-page/","hide":true}
---

This page is hidden from the folder tree!
==========
004 Publishing this garden.md
==========
---
{"dg-publish":true,"permalink":"/004-publishing-this-garden/"}
---

To use this test garden, add a test garden token / username / repo to `.env` (see README.md)



==========
005 Custom filters.md
==========
---
{"dg-publish":true,"permalink":"/005-custom-filters/"}
---



this plugin has custom filter that turns 🌞 (snow emoji) into 🌞 (THE SUN). When published, this file should have a lot of sun-emojis. 


🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞

==========
006 Custom title.md
==========
---
{"dg-publish":true,"permalink":"/006-custom-title/","title":"006 THIS IS A CUSTOM TITLE"}
---

[Custom title](https://dg-docs.ole.dev/advanced/note-specific-settings/)

==========
007 Custom permalink.md
==========
---
{"dg-publish":true,"dg-permalink":"my-name-is-permalink/custom-permalink","permalink":"/my-name-is-permalink/custom-permalink/"}
---

[Custom permalink](https://dg-docs.ole.dev/advanced/note-specific-settings/)


==========
008 Pinned note.md
==========
---
{"dg-publish":true,"permalink":"/008-pinned-note/","pinned":true}
---

Hello! I'm a pinned note (should be at the top yeah!)
==========
009 Comments.md
==========
---
{"dg-publish":true,"permalink":"/009-comments/"}
---

This is the only content on this page


==========
010 custom createdAt.md
==========
---
{"dg-publish":true,"permalink":"/010-custom-created-at/","created":"2020-01-01"}
---

This file should have createdAt: 2020-01-01
==========
011 Custom updatedAt.md
==========
---
{"dg-publish":true,"permalink":"/011-custom-updated-at/","updated":"2021-01-01"}
---

This file should have updatedAt: 2021-01-01

==========
012 Callouts.md
==========
---
{"dg-publish":true,"permalink":"/012-callouts/"}
---

#known-issue 

> [!info]
> This is a callout


> [!info]- this one is closed by default
> > [!success] and has a callout inside of it :o
> > anything is possible :)


> [!info] This one has dataview in it...
>  - [[012 Callouts\|012 Callouts]]
> 
{ .block-language-dataview}

> [!success] this one has a friggin note embedded in it 
> 
<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">




```js
const asdf = 0
asdf++
```

```json
{
	gotta: "love-dat-josn"
}
```

```
this is just text i guess
```

`bonus oneliner`



</div></div>




==========
012-B Callouts less broken.md
==========
---
{"dg-publish":true,"permalink":"/012-b-callouts-less-broken/"}
---


> [!info]
> This is a callout


> [!info]- this one is closed by default
> > [!success] and has a callout inside of it :o
> > anything is possible :)

#known-issue 
> [!success] this one has a friggin note embedded in it 
> 
<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">




```js
const asdf = 0
asdf++
```

```json
{
	gotta: "love-dat-josn"
}
```

```
this is just text i guess
```

`bonus oneliner`



</div></div>





==========
013 Custom path.md
==========
---
{"dg-publish":true,"dg-path":"custom path/should also write to permalink","permalink":"/custom-path/should-also-write-to-permalink/"}
---


==========
014 Customer path and permalink.md
==========
---
{"dg-publish":true,"dg-path":"custom path/should not overwrite permalink","dg-permalink":"custom link/shouldBeDifferentToPath","permalink":"/custom link/shouldBeDifferentToPath/"}
---


==========
015 Code blocks.md
==========
---
{"dg-publish":true,"permalink":"/015-code-blocks/"}
---

These codeblocks should not be modified upon publish.

Sample 1
```jinja2
{{ highlight_text }}{% if highlight_location and highlight_location_url %} ([via]({{highlight_location_url}})){% elif highlight_location %} ({{highlight_location}}){% endif %} ^rwhi{{highlight_id}}
{% if highlight_note %}
{{ highlight_note }} ^rwhi{{highlight_id}}-note
{% endif %}
```

Sample 2
```md
In medieval Latin a florilegium (plural florilegia) was a compilation of excerpts from other writings.
 The word is from the Latin flos (flower) and legere (to gather): literally a gathering of flowers, or collection of fine extracts from the body of a larger work. ([via](https://en.wikipedia.org/wiki/Florilegium)) ^rwhi724352030
```

Sample 3
```
This codeblock has a transclusion syntax in it.
Check it out: 
<div class="transclusion internal-embed is-loaded"><a class="markdown-embed-link" href="/001-links/" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a><div class="markdown-embed">




[[002 Hidden page]]

[[003 Non published page]]

[[000 Home| Aliased link to home]]

[[000 Home | Link containing whitespace which works in obsidian but doesn't in garden :) - yes, this could be a ticket but lo and behold]]



</div></div>

```

And for sanity, here's some block references outside of code blocks: foobar
{ #test-123}

==========
E Embeds/E02 PNG published.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/e02-png-published/"}
---



![travolta.png](/img/user/A%20Assets/travolta.png)
/img/user/A Assets/travolta.png
==========
E Embeds/E04 PNG reuse.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/e04-png-reuse/"}
---

This file uses the same image as in [[E Embeds/E03 PNG_not_published\|E03 PNG_not_published]]. When removing the other one, the image should not be removed. 

![unused_image.png|100](/img/user/A%20Assets/unused_image.png)
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
==========
E Embeds/E05 WEBP published.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/e05-webp-published/"}
---


![travolta.webp](/img/user/A%20Assets/travolta.webp)
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
E Embeds/E07 Image with alt attributes.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/e07-image-with-alt-attributes/"}
---

This should render to a 200 px wide image with the alt text "center"
Like so: `![travolta.png|center|200](/img/user/A%20Assets/travolta.png)`
![travolta.png|center|200](/img/user/A%20Assets/travolta.png)


This should render to an image with the alt text "left", like so:
`[travolta.png|left](/img/user/A%20Assets/travolta.png)`
![travolta.png|left](/img/user/A%20Assets/travolta.png)
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
E Embeds/Transclusions/T1 BaseFile.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/transclusions/t1-base-file/"}
---



<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">




How deep can you go? 

[[E Embeds/Transclusions/files/T4 Deeper\|T4 Deeper]]


<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">

<div class="markdown-embed-title">

# Spice it up

</div>



I can go deeper!


<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">




There must be a limit!!!

[[E Embeds/Transclusions/T1 BaseFile\|T1 BaseFile]] recursive linking yay


<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">




This is as far as we can go! Or is it???

![[E Embeds/Transclusions/T2 Too deep to transclude\| This transclusion will be left out :(())]]

</div></div>


</div></div>


Bonus: 

<div class="transclusion internal-embed is-loaded"><a class="markdown-embed-link" href="/p-plugins/pe-excalidraw/pe-1-transcluded-excalidraw/" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a><div class="markdown-embed">





<style> .container {font-family: sans-serif; text-align: center;} .button-wrapper button {z-index: 1;height: 40px; width: 100px; margin: 10px;padding: 5px;} .excalidraw .App-menu_top .buttonList { display: flex;} .excalidraw-wrapper { height: 800px; margin: 50px; position: relative;} :root[dir="ltr"] .excalidraw .layer-ui__wrapper .zen-mode-transition.App-menu_bottom--transition-left {transform: none;} </style><script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script><script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script><script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0/dist/excalidraw.production.min.js"></script><div id="Drawing_2023-09-23_2241.09.excalidraw.md1"></div><script>(function(){const InitialData={"type":"excalidraw","version":2,"source":"https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/1.9.19","elements":[{"id":"CZsgDfedEqsrXkSK9gQJH","type":"rectangle","x":-231.33984375,"y":-252.75,"width":222,"height":93.296875,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":3},"seed":834466567,"version":54,"versionNonce":1029562215,"isDeleted":false,"boundElements":[{"id":"ezIUrt6yrVW9zFYWBb6Fx","type":"arrow"}],"updated":1695498089101,"link":null,"locked":false},{"id":"SvNLuaih","type":"text","x":-179.35546875,"y":-209.0703125,"width":41.89994812011719,"height":25,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":null,"seed":1422140583,"version":5,"versionNonce":655470793,"isDeleted":false,"boundElements":null,"updated":1695498085088,"link":null,"locked":false,"text":"beep","rawText":"beep","fontSize":20,"fontFamily":1,"textAlign":"left","verticalAlign":"top","baseline":18,"containerId":null,"originalText":"beep","lineHeight":1.25},{"id":"ezIUrt6yrVW9zFYWBb6Fx","type":"arrow","x":-8.67578125,"y":-157.16796875,"width":105.06640625,"height":109.1796875,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":2},"seed":1011929737,"version":32,"versionNonce":1434943559,"isDeleted":false,"boundElements":null,"updated":1695498089101,"link":null,"locked":false,"points":[[0,0],[105.06640625,109.1796875]],"lastCommittedPoint":null,"startBinding":{"elementId":"CZsgDfedEqsrXkSK9gQJH","focus":-0.4142254509017335,"gap":2.28515625},"endBinding":null,"startArrowhead":null,"endArrowhead":"arrow"},{"id":"DCQM7O8k","type":"text","x":112.515625,"y":-27.84375,"width":42.17994689941406,"height":25,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":null,"seed":358308487,"version":5,"versionNonce":1560033513,"isDeleted":false,"boundElements":null,"updated":1695498093145,"link":null,"locked":false,"text":"boop","rawText":"boop","fontSize":20,"fontFamily":1,"textAlign":"left","verticalAlign":"top","baseline":18,"containerId":null,"originalText":"boop","lineHeight":1.25},{"id":"rN0xD5d1otB0Txp8mrVKE","type":"rectangle","x":94.73046875,"y":-44.63671875,"width":76.48046875,"height":59.0703125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":3},"seed":1024447145,"version":54,"versionNonce":1399780105,"isDeleted":false,"boundElements":null,"updated":1695498097327,"link":null,"locked":false},{"id":"EAi6LVWi5tLJIMLTDPXa7","type":"line","x":93.21875,"y":24.30078125,"width":80.23046875,"height":83.078125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":2},"seed":795411751,"version":27,"versionNonce":309139625,"isDeleted":false,"boundElements":null,"updated":1695498103612,"link":null,"locked":false,"points":[[0,0],[-80.23046875,83.078125]],"lastCommittedPoint":null,"startBinding":null,"endBinding":null,"startArrowhead":null,"endArrowhead":null},{"id":"LIzHXsQpdg5HRqdFJywOn","type":"rectangle","x":-90.056640625,"y":115.9765625,"width":103,"height":59,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":3},"seed":611720073,"version":64,"versionNonce":2050110535,"isDeleted":false,"boundElements":[{"type":"text","id":"ASLeSCTL"}],"updated":1695498114978,"link":null,"locked":false},{"id":"ASLeSCTL","type":"text","x":-64.65660858154297,"y":132.9765625,"width":52.19993591308594,"height":25,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":null,"seed":1398305225,"version":6,"versionNonce":1100335623,"isDeleted":false,"boundElements":null,"updated":1695498114039,"link":null,"locked":false,"text":"bebop","rawText":"bebop","fontSize":20,"fontFamily":1,"textAlign":"center","verticalAlign":"middle","baseline":18,"containerId":"LIzHXsQpdg5HRqdFJywOn","originalText":"bebop","lineHeight":1.25}],"appState":{"theme":"light","viewBackgroundColor":"#ffffff","currentItemStrokeColor":"#1e1e1e","currentItemBackgroundColor":"transparent","currentItemFillStyle":"hachure","currentItemStrokeWidth":1,"currentItemStrokeStyle":"solid","currentItemRoughness":1,"currentItemOpacity":100,"currentItemFontFamily":1,"currentItemFontSize":20,"currentItemTextAlign":"left","currentItemStartArrowhead":null,"currentItemEndArrowhead":"arrow","scrollX":339,"scrollY":360.9765625,"zoom":{"value":1},"currentItemRoundness":"round","gridSize":null,"gridColor":{"Bold":"#C9C9C9FF","Regular":"#EDEDEDFF"},"currentStrokeOptions":null,"previousGridSize":null,"frameRendering":{"enabled":true,"clip":true,"name":true,"outline":true}},"files":{}};InitialData.scrollToContent=true;App=()=>{const e=React.useRef(null),t=React.useRef(null),[n,i]=React.useState({width:void 0,height:void 0});return React.useEffect(()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height});const e=()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height})};return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[t]),React.createElement(React.Fragment,null,React.createElement("div",{className:"excalidraw-wrapper",ref:t},React.createElement(ExcalidrawLib.Excalidraw,{ref:e,width:n.width,height:n.height,initialData:InitialData,viewModeEnabled:!0,zenModeEnabled:!0,gridModeEnabled:!1})))},excalidrawWrapper=document.getElementById("Drawing_2023-09-23_2241.09.excalidraw.md1");ReactDOM.render(React.createElement(App),excalidrawWrapper);})();</script>

</div></div>


Bonus pic: 

![travolta.png|100](/img/user/A%20Assets/travolta.png)



</div></div>


</div></div>

/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
E Embeds/Transclusions/T2 Too deep to transclude.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/transclusions/t2-too-deep-to-transclude/"}
---

This one isn't isn't transcluded anymore (too deep)

![travolta.png|100](/img/user/A%20Assets/travolta.png)
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
E Embeds/Transclusions/T3 Transcluded block.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/transclusions/t3-transcluded-block/"}
---


Below it should just say "cheese": 


<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">



cheese 

</div></div>


/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
E Embeds/Transclusions/T4 Transcluded header.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/transclusions/t4-transcluded-header/"}
---


Below should be a header and one line of text: 

<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">



## Header

This should be in this header block


</div></div>



/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
E Embeds/Transclusions/T5 transclude custom filters.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/transclusions/t5-transclude-custom-filters/"}
---



<div class="transclusion internal-embed is-loaded"><a class="markdown-embed-link" href="/005-custom-filters/" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a><div class="markdown-embed">






this plugin has custom filter that turns 🌞 (snow emoji) into 🌞 (THE SUN). When published, this file should have a lot of sun-emojis. 


🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞


</div></div>

/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
E Embeds/Transclusions/T6 transclusion inside codeblock.md
==========
---
{"dg-publish":true,"permalink":"/e-embeds/transclusions/t6-transclusion-inside-codeblock/"}
---

#known-issue [Issue](https://github.com/oleeskild/obsidian-digital-garden/issues/113)

Transclusions inside code blocks should not show transcluded content, but the literal text inside. Currently it transcludes the content

`
<div class="transclusion internal-embed is-loaded"><a class="markdown-embed-link" href="/005-custom-filters/" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a><div class="markdown-embed">






this plugin has custom filter that turns 🌞 (snow emoji) into 🌞 (THE SUN). When published, this file should have a lot of sun-emojis. 


🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞


</div></div>
`

```

<div class="transclusion internal-embed is-loaded"><a class="markdown-embed-link" href="/005-custom-filters/" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a><div class="markdown-embed">






this plugin has custom filter that turns 🌞 (snow emoji) into 🌞 (THE SUN). When published, this file should have a lot of sun-emojis. 


🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞🌞


</div></div>

```
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
L Languages/Transclude Headers.md
==========
---
{"dg-publish":true,"permalink":"/l-languages/transclude-headers/"}
---



<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">



#  解决

This should be visible when transcluding the header above



</div></div>


/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
L Links/01 Link to header.md
==========
---
{"dg-publish":true,"permalink":"/l-links/01-link-to-header/"}
---

Link to header should keep header link info
[[000 Home#Welcome\|000 Home#Welcome]]

Link to header with special characters should work

<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">



# A header: With a colon
Body under header


</div></div>

/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
P Plugins/PD Dataview/PD1 Dataview.md
==========
---
{"dg-publish":true,"permalink":"/p-plugins/pd-dataview/pd-1-dataview/"}
---

I'm a list of all files in this folder: 

- [[P Plugins/PD Dataview/PD0 - note with summary\|PD0 - note with summary]]
- [[P Plugins/PD Dataview/PD1 Dataview\|PD1 Dataview]]
- [[P Plugins/PD Dataview/PD2 Inline queries\|PD2 Inline queries]]
- [[P Plugins/PD Dataview/PD3 Inline JS queries\|PD3 Inline JS queries]]
- [[P Plugins/PD Dataview/PD4 DataviewJs queries\|PD4 DataviewJs queries]]
- [[P Plugins/PE Excalidraw/PE1 Transcluded excalidraw\|PE1 Transcluded excalidraw]]
- [[P Plugins/PE Excalidraw/PE2 excalidraw with image\|PE2 excalidraw with image]]

{ .block-language-dataview}

/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
P Plugins/PD Dataview/PD2 Inline queries.md
==========
---
{"dg-publish":true,"permalink":"/p-plugins/pd-dataview/pd-2-inline-queries/"}
---



PD2 Inline queries

this note is about foo

/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
P Plugins/PD Dataview/PD3 Inline JS queries.md
==========
---
{"dg-publish":true,"permalink":"/p-plugins/pd-dataview/pd-3-inline-js-queries/"}
---


3
108
<p><span>A paragraph</span></p>

/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
P Plugins/PD Dataview/PD4 DataviewJs queries.md
==========
---
{"dg-publish":true,"permalink":"/p-plugins/pd-dataview/pd-4-dataview-js-queries/"}
---

<h2><span>Header 2</span></h2><p><span>PD4 DataviewJs queries</span></p>

<div><table class="dataview table-view-table"><thead class="table-view-thead"><tr class="table-view-tr-header"><th class="table-view-th"><span>name</span><span class="dataview small-text">6</span></th><th class="table-view-th"><span>link</span></th></tr></thead><tbody class="table-view-tbody"><tr><td><span>005 Custom filters</span></td><td><span><a data-tooltip-position="top" aria-label="005 Custom filters.md" data-href="005 Custom filters.md" href="005 Custom filters.md" class="internal-link" target="_blank" rel="noopener">005 Custom filters</a></span></td></tr><tr><td><span>006 Custom title</span></td><td><span><a data-tooltip-position="top" aria-label="006 Custom title.md" data-href="006 Custom title.md" href="006 Custom title.md" class="internal-link" target="_blank" rel="noopener">006 Custom title</a></span></td></tr><tr><td><span>007 Custom permalink</span></td><td><span><a data-tooltip-position="top" aria-label="007 Custom permalink.md" data-href="007 Custom permalink.md" href="007 Custom permalink.md" class="internal-link" target="_blank" rel="noopener">007 Custom permalink</a></span></td></tr><tr><td><span>011 Custom updatedAt</span></td><td><span><a data-tooltip-position="top" aria-label="011 Custom updatedAt.md" data-href="011 Custom updatedAt.md" href="011 Custom updatedAt.md" class="internal-link" target="_blank" rel="noopener">011 Custom updatedAt</a></span></td></tr><tr><td><span>013 Custom path</span></td><td><span><a data-tooltip-position="top" aria-label="013 Custom path.md" data-href="013 Custom path.md" href="013 Custom path.md" class="internal-link" target="_blank" rel="noopener">013 Custom path</a></span></td></tr><tr><td><span>014 Customer path and permalink</span></td><td><span><a data-tooltip-position="top" aria-label="014 Customer path and permalink.md" data-href="014 Customer path and permalink.md" href="014 Customer path and permalink.md" class="internal-link" target="_blank" rel="noopener">014 Customer path and permalink</a></span></td></tr></tbody></table></div>


/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
P Plugins/PE Excalidraw/PE1 Transcluded excalidraw.md
==========
---
{"dg-publish":true,"permalink":"/p-plugins/pe-excalidraw/pe-1-transcluded-excalidraw/"}
---


<style> .container {font-family: sans-serif; text-align: center;} .button-wrapper button {z-index: 1;height: 40px; width: 100px; margin: 10px;padding: 5px;} .excalidraw .App-menu_top .buttonList { display: flex;} .excalidraw-wrapper { height: 800px; margin: 50px; position: relative;} :root[dir="ltr"] .excalidraw .layer-ui__wrapper .zen-mode-transition.App-menu_bottom--transition-left {transform: none;} </style><script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script><script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script><script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0/dist/excalidraw.production.min.js"></script><div id="Drawing_2023-09-23_2241.09.excalidraw.md1"></div><script>(function(){const InitialData={"type":"excalidraw","version":2,"source":"https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/1.9.19","elements":[{"id":"CZsgDfedEqsrXkSK9gQJH","type":"rectangle","x":-231.33984375,"y":-252.75,"width":222,"height":93.296875,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":3},"seed":834466567,"version":54,"versionNonce":1029562215,"isDeleted":false,"boundElements":[{"id":"ezIUrt6yrVW9zFYWBb6Fx","type":"arrow"}],"updated":1695498089101,"link":null,"locked":false},{"id":"SvNLuaih","type":"text","x":-179.35546875,"y":-209.0703125,"width":41.89994812011719,"height":25,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":null,"seed":1422140583,"version":5,"versionNonce":655470793,"isDeleted":false,"boundElements":null,"updated":1695498085088,"link":null,"locked":false,"text":"beep","rawText":"beep","fontSize":20,"fontFamily":1,"textAlign":"left","verticalAlign":"top","baseline":18,"containerId":null,"originalText":"beep","lineHeight":1.25},{"id":"ezIUrt6yrVW9zFYWBb6Fx","type":"arrow","x":-8.67578125,"y":-157.16796875,"width":105.06640625,"height":109.1796875,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":2},"seed":1011929737,"version":32,"versionNonce":1434943559,"isDeleted":false,"boundElements":null,"updated":1695498089101,"link":null,"locked":false,"points":[[0,0],[105.06640625,109.1796875]],"lastCommittedPoint":null,"startBinding":{"elementId":"CZsgDfedEqsrXkSK9gQJH","focus":-0.4142254509017335,"gap":2.28515625},"endBinding":null,"startArrowhead":null,"endArrowhead":"arrow"},{"id":"DCQM7O8k","type":"text","x":112.515625,"y":-27.84375,"width":42.17994689941406,"height":25,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":null,"seed":358308487,"version":5,"versionNonce":1560033513,"isDeleted":false,"boundElements":null,"updated":1695498093145,"link":null,"locked":false,"text":"boop","rawText":"boop","fontSize":20,"fontFamily":1,"textAlign":"left","verticalAlign":"top","baseline":18,"containerId":null,"originalText":"boop","lineHeight":1.25},{"id":"rN0xD5d1otB0Txp8mrVKE","type":"rectangle","x":94.73046875,"y":-44.63671875,"width":76.48046875,"height":59.0703125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":3},"seed":1024447145,"version":54,"versionNonce":1399780105,"isDeleted":false,"boundElements":null,"updated":1695498097327,"link":null,"locked":false},{"id":"EAi6LVWi5tLJIMLTDPXa7","type":"line","x":93.21875,"y":24.30078125,"width":80.23046875,"height":83.078125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":2},"seed":795411751,"version":27,"versionNonce":309139625,"isDeleted":false,"boundElements":null,"updated":1695498103612,"link":null,"locked":false,"points":[[0,0],[-80.23046875,83.078125]],"lastCommittedPoint":null,"startBinding":null,"endBinding":null,"startArrowhead":null,"endArrowhead":null},{"id":"LIzHXsQpdg5HRqdFJywOn","type":"rectangle","x":-90.056640625,"y":115.9765625,"width":103,"height":59,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":3},"seed":611720073,"version":64,"versionNonce":2050110535,"isDeleted":false,"boundElements":[{"type":"text","id":"ASLeSCTL"}],"updated":1695498114978,"link":null,"locked":false},{"id":"ASLeSCTL","type":"text","x":-64.65660858154297,"y":132.9765625,"width":52.19993591308594,"height":25,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":null,"seed":1398305225,"version":6,"versionNonce":1100335623,"isDeleted":false,"boundElements":null,"updated":1695498114039,"link":null,"locked":false,"text":"bebop","rawText":"bebop","fontSize":20,"fontFamily":1,"textAlign":"center","verticalAlign":"middle","baseline":18,"containerId":"LIzHXsQpdg5HRqdFJywOn","originalText":"bebop","lineHeight":1.25}],"appState":{"theme":"light","viewBackgroundColor":"#ffffff","currentItemStrokeColor":"#1e1e1e","currentItemBackgroundColor":"transparent","currentItemFillStyle":"hachure","currentItemStrokeWidth":1,"currentItemStrokeStyle":"solid","currentItemRoughness":1,"currentItemOpacity":100,"currentItemFontFamily":1,"currentItemFontSize":20,"currentItemTextAlign":"left","currentItemStartArrowhead":null,"currentItemEndArrowhead":"arrow","scrollX":339,"scrollY":360.9765625,"zoom":{"value":1},"currentItemRoundness":"round","gridSize":null,"gridColor":{"Bold":"#C9C9C9FF","Regular":"#EDEDEDFF"},"currentStrokeOptions":null,"previousGridSize":null,"frameRendering":{"enabled":true,"clip":true,"name":true,"outline":true}},"files":{}};InitialData.scrollToContent=true;App=()=>{const e=React.useRef(null),t=React.useRef(null),[n,i]=React.useState({width:void 0,height:void 0});return React.useEffect(()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height});const e=()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height})};return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[t]),React.createElement(React.Fragment,null,React.createElement("div",{className:"excalidraw-wrapper",ref:t},React.createElement(ExcalidrawLib.Excalidraw,{ref:e,width:n.width,height:n.height,initialData:InitialData,viewModeEnabled:!0,zenModeEnabled:!0,gridModeEnabled:!1})))},excalidrawWrapper=document.getElementById("Drawing_2023-09-23_2241.09.excalidraw.md1");ReactDOM.render(React.createElement(App),excalidrawWrapper);})();</script>
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
P Plugins/PE Excalidraw/PE2 excalidraw with image.md
==========
---
{"dg-publish":true,"permalink":"/p-plugins/pe-excalidraw/pe-2-excalidraw-with-image/"}
---

#known-issue 


<style> .container {font-family: sans-serif; text-align: center;} .button-wrapper button {z-index: 1;height: 40px; width: 100px; margin: 10px;padding: 5px;} .excalidraw .App-menu_top .buttonList { display: flex;} .excalidraw-wrapper { height: 800px; margin: 50px; position: relative;} :root[dir="ltr"] .excalidraw .layer-ui__wrapper .zen-mode-transition.App-menu_bottom--transition-left {transform: none;} </style><script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script><script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script><script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0/dist/excalidraw.production.min.js"></script><div id="with_imageexcalidraw.md1"></div><script>(function(){const InitialData={"type":"excalidraw","version":2,"source":"https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/1.9.19","elements":[{"type":"text","version":17,"versionNonce":1765827278,"isDeleted":false,"id":"etjlThVL","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":-87.19921875,"y":99.1875,"strokeColor":"#1e1e1e","backgroundColor":"transparent","width":120.55990600585938,"height":25,"seed":1087805266,"groupIds":[],"frameId":null,"roundness":null,"boundElements":[],"updated":1696178356575,"link":null,"locked":false,"fontSize":20,"fontFamily":1,"text":"tis an image","rawText":"tis an image","textAlign":"left","verticalAlign":"top","containerId":null,"originalText":"tis an image","lineHeight":1.25,"baseline":18},{"type":"text","version":91,"versionNonce":1701927762,"isDeleted":false,"id":"Pu1GJH4c","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":-149.30078125,"y":152.25390625,"strokeColor":"#1e1e1e","backgroundColor":"transparent","width":310.2197265625,"height":25,"seed":1793030738,"groupIds":[],"frameId":null,"roundness":null,"boundElements":[],"updated":1696178434561,"link":null,"locked":false,"fontSize":20,"fontFamily":1,"text":"it's not uploaded automatically","rawText":"it's not uploaded automatically","textAlign":"left","verticalAlign":"top","containerId":null,"originalText":"it's not uploaded automatically","lineHeight":1.25,"baseline":18},{"type":"text","version":23,"versionNonce":2137370830,"isDeleted":false,"id":"m40NMLqr","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":-130.09765625,"y":232.0859375,"strokeColor":"#1e1e1e","backgroundColor":"transparent","width":220.039794921875,"height":25,"seed":546057938,"groupIds":[],"frameId":null,"roundness":null,"boundElements":[],"updated":1696178440853,"link":null,"locked":false,"fontSize":20,"fontFamily":1,"text":"this is a bug of sorts","rawText":"this is a bug of sorts","textAlign":"left","verticalAlign":"top","containerId":null,"originalText":"this is a bug of sorts","lineHeight":1.25,"baseline":18},{"id":"HcrLXEvs44rS67hJzeV1v","type":"image","x":-175.90966796875,"y":-266.54738451086945,"width":356.52173913043475,"height":356.52173913043475,"angle":0,"strokeColor":"transparent","backgroundColor":"transparent","fillStyle":"hachure","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":null,"seed":1427244047,"version":24,"versionNonce":350668687,"isDeleted":false,"boundElements":null,"updated":1696271725883,"link":null,"locked":false,"status":"pending","fileId":"f5de7e7b9672dcaec815dbbc90d72635f638da20","scale":[1,1]}],"appState":{"theme":"light","viewBackgroundColor":"#ffffff","currentItemStrokeColor":"#1e1e1e","currentItemBackgroundColor":"transparent","currentItemFillStyle":"hachure","currentItemStrokeWidth":1,"currentItemStrokeStyle":"solid","currentItemRoughness":1,"currentItemOpacity":100,"currentItemFontFamily":1,"currentItemFontSize":20,"currentItemTextAlign":"left","currentItemStartArrowhead":null,"currentItemEndArrowhead":"arrow","scrollX":156.7996136209239,"scrollY":234.79127038043467,"zoom":{"value":1.1500000000000001},"currentItemRoundness":"round","gridSize":null,"gridColor":{"Bold":"#C9C9C9FF","Regular":"#EDEDEDFF"},"currentStrokeOptions":null,"previousGridSize":null,"frameRendering":{"enabled":true,"clip":true,"name":true,"outline":true}},"files":{}};InitialData.scrollToContent=true;App=()=>{const e=React.useRef(null),t=React.useRef(null),[n,i]=React.useState({width:void 0,height:void 0});return React.useEffect(()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height});const e=()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height})};return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[t]),React.createElement(React.Fragment,null,React.createElement("div",{className:"excalidraw-wrapper",ref:t},React.createElement(ExcalidrawLib.Excalidraw,{ref:e,width:n.width,height:n.height,initialData:InitialData,viewModeEnabled:!0,zenModeEnabled:!0,gridModeEnabled:!1})))},excalidrawWrapper=document.getElementById("with_imageexcalidraw.md1");ReactDOM.render(React.createElement(App),excalidrawWrapper);})();</script>


/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
Path Rewriting/004 Folder set to root.md
==========
---
{"dg-publish":true,"dg-path":"004 Folder set to root.md","permalink":"/004-folder-set-to-root/"}
---

This folder is set in path rewrite settings as 

`folder:`

This means this file should be in the root directory :) 

This subfolder also contains path rewrite testing! 

/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
Path Rewriting/Subfolder/How deep do the rewrite rules go.md
==========
---
{"dg-publish":true,"dg-path":"Subfolder/How deep do the rewrite rules go.md","permalink":"/subfolder/how-deep-do-the-rewrite-rules-go/"}
---

With the rewrite rules: 

```
Path Rewriting:
Subfolder:subfolder-rewritten
Path Rewriting/Subfolder:this-will-never-hit
```

Will this file be in folder `subfolder-rewritten` or in `Subfolder`?

It should be in Subfolder as "matching exits on first hit"
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
Path Rewriting/Subfolder2/More specific path rewriting.md
==========
---
{"dg-publish":true,"dg-path":"fun-folder/More specific path rewriting.md","permalink":"/fun-folder/more-specific-path-rewriting/"}
---

This Subfolder has been rewritten before the rule to rewrite the Path Rewriting folder to root

```
Path Rewriting/Subfolder2:fun-folder
Path Rewriting:
```
/img/user/A Assets/travolta.png
,/img/user/A Assets/unused_image.png
,/img/user/A Assets/travolta.webp
==========
