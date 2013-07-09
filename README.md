slider-lite
===========

A simple jquery-plugin slider

## CSS

```
.slide,
.slide-inner {
    position: relative;
    overflow: hidden;
    height: 460px;
}
.slide .item {
   display: none;
   position: absolute;
   width: 100%;
}
.slide .item.active {
    display: block;
}
.slide .item > img {
    display: block;
    max-width: 100%;
}
.slide-nav {
    position: absolute;
    top: 50%;
    display: block;
    height: 50px;
    width: 50px;
    color: #fff;
    background-color: #333;
    opacity: .8;
    line-height: 50px;
    text-align: center;
}
.slide-nav.prev {
    left: 0;
}
.slide-nav.next {
    right: 0;
}
```

## Usage

```
$('.slide').slide({
	speed: 0.8, //0.8s
	delay: 3, //3s
	direction: 'left',//right, top, bottom
	easing: 'swing',
	autoplay: true
})
```

