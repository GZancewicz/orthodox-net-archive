#!/usr/local/com/perl 
use Cwd; 

chdir( "d:/www/orthodox.net/russia" );

@files=( <*.html>);

$template		= "d:/www/orthodox.net/russia/index.html"; 

foreach $file ( @files ) 
{
	$file =~ tr/A-Z/a-z/;
	next if ( $file =~ /.*3rows.*/ ); 
	next if ( $file =~ /index.html/ );
	&process;
}

&index; 

sub process
{
	
	return unless open IN,"$file"; 
	print "FILE:$file\n"; 
	$get_title=0; 
	$title="";
	foreach ( <IN> ) 
	{ 
		chomp;
		if( /<title>/i ) 
		{ 
			$title .= $'; 
			if ( $title =~ /<\/title>.*$/i ) 
			{ 
				$title=$`;
			}
			else 
			{
				$get_title=1;
			}	
			break;
		}
		if( $get_title && /<\/TITLE>/i ) 
		{ 
			$title .= $`; 
			$get_title=0;
		}
	}
	close IN; 
	$files{$file}=$title if ( $title); 
}

sub index
{
    return unless open IN,"index.html"; @in=(); @in=<IN>; close IN; 
	open OUT,">index.html";
	$printLine=1;
	foreach ( @in ) 
	{ 
		if( /^\s*<!--\s*BEGIN:Row2Col3Text/i ) 
		{
			$printLine=0;
			print OUT;
			print OUT "<UL>\n";
			foreach $file ( sort keys (%files) )
			{
				print OUT "<LI><A HREF=$file>$files{$file}</A>\n";
			}
			print OUT "</UL>\n";
			next;
		}
		$printLine =1 if( /^\s*<!--\s*END:Row2Col3Text/i ); 
		print OUT if ($printLine);
	}
}