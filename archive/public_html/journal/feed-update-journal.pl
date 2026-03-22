#!/usr/local/com/perl
use Cwd; 
use File::Basename; 
use File::Copy;

$xml="c:/www/orthodox.net/journal/feed-journal.xml"; 

sub process
{
	$link=$_; 
	@months= ( "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec" );


	/(\d\d\d\d)-(\d\d)-(\d\d)/;

	$pubDate="$3 $months[$2 - 1] $1";
	
	# date        =  1*2DIGIT month 2DIGIT        ; day month year
    #                                             ;  e.g. 20 Jun 82
	
	$description="";

	while( not eof(IN) ) 
	{ 
		$_=<IN>; 
		last if /^\s*$/;
		chomp;
		$description .= "$_ ";
	}

	($file=$link) =~ s!.*/!!; 
	if( open( FILE,"../$file" ) )
	{ 
		$title=""; $add=0;
		while( ! eof(FILE) ) 
		{ 
			$_=<FILE>;
			chomp;
			$add=1 if( /<title>/i );
			$title .= $_ if $add;
			last if m!</TITLE>!i; 
		} 
		$title =~ s!TITLE>!title>!i; 
		$title =~ s/^\s*//;
		close FILE;
	}
	else 
	{ 
		$title="<title>$description</title>"; 
	}
	
	print XML <<"END"; 

<item>
$title
<description>$description</description>
<link>$link</link>
<guid>$link</guid>
<pubDate>$pubDate</pubDate>
</item>
END

}
chdir "C:/www/orthodox.net/journal/txt"; 

open XML,">$xml"; 

print XML <<"END"; 
<?xml version="1.0"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xml:lang='en-US'>
<channel>
<atom:link href="https://www.orthodox.net//journal/feed-journal.xml" rel="self" type="application/rss+xml" />
<title>An Orthodox Christian priest's almost daily pastoral journal by Priest Seraphim Holland</title>
<description>An Orthodox Christian priest's almost daily pastoral journal by Priest Seraphim Holland. Commentary on scripture, prayers, services, spiritual topics, catechesis, homilies, and whatever else comes to mind.</description>
<link>https://www.orthodox.net//journal/</link>
<language>en-us</language>
<copyright>(C) 2009 Priest Seraphim Holland</copyright>

END

open IN,"index.txt"; 

while( not eof(IN) ) 
{ 
	$_=<IN>; 
	next unless /^http:/; 
	chomp; process();
}

print XML "\n</channel>\n</rss>\n";