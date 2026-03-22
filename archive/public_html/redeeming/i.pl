$indir="d:\\www\\orthodox.net\\redeeming"; 

@files = <$indir/r*.html>;

foreach $file ( @files ) 
{
	$file =~ s/.*\///; 
	print "file:$file\n"; 
	if( open (IN,"<$file") )
	{ 
		$title="";
		while ( $_ = <IN> ) 
		{
			if( /.*<TITLE>/ ) 
			{ 
				if( $' ) 
				{ 
					$title=$'; 
					last; 
				}
				else 
				{
					$title = <IN>; 
					last; 
				}
			}
		}
		close(IN); 
		if($title) 
		{
			$title =~ s/<\/TITLE>.*$//i;
			$title =~ s/Redeeming the Time//i;
			$title =~ s/Sunday/Sun/i;
			$title =~ s/Vol\.//i; 
			$title =~ s/Volume//i;
			$title =~ s/Vol//i;
			$titles{$file}=$title;
		}
	}
}

open( OUT,">$indir/index.html" );
print OUT <<"END"; 
<HTML>
<HEAD>
<TITLE>
Redeeming the Time - Index
</TITLE>
</HEAD>
<BODY>
<CENTER>
<H1>
Redeeming the Time - Index
</H1>
<form method=GET action="http://www.findmail.com/subscribe"> <input type=hidden name="listname" value="redeemingthetime"><table bgcolor=#000000 border=0 cellpadding=1 cellspacing=0><tr><td><table width=300 bgcolor=#ffffcc border=0 cellpadding=3 cellspacing=0><tr><td bgcolor=#000000 width=100% ALIGN=center><font face="arial,helvetica" color=#FFFFFF><b>Subscribe to Redeeming the Time</b></font></td></tr><tr><td>Enter your e-mail address:</td></tr><tr><td><input type=text name="emailaddr" value="your e-mail" size=21><input type=submit name="SubmitAction" VALUE="Subscribe"></td></tr><tr><td><a href="http://www.findmail.com/list/redeemingthetime/">FindMail List Archive</a></td></tr><tr><td><font face="arial,helvetica" size=-1>A mailing list hosted by <a href="http://www.findmail.com/">FindMail</A></font></td></tr> </TABLE></td></tr></TABLE></form>

</CENTER>
<HR WIDTH=50-%>
<UL>
END

foreach ( sort keys(%titles) ) 
{ 
	print OUT "<LI><A HREF=\"$_\">$titles{$_}</A>\n";
}

print OUT "</UL>\n"; 

if ( open(IN,"<d:\\www\\orthodox.net\\nicholassig.html") )
{ 
	print "signature\n";	
	print OUT <IN>; 
	close(IN);
}
print OUT "<BODY>\n</HTML>\n";
close(OUT);

