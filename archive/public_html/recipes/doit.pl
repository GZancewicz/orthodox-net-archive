open IN,"old.lenten_main_dishes.html"; 

$header=0;

while ( <IN> ) 
{ 
	if( /BEGIN:Header/ ) 
	{
		$file="";
		$title="";
		while( <IN> ) 
		{ 
			last if ( /<!--\s*END:Header\s*-->/i );
			chomp;
			s/<[^>]*>//g;
			next if ( /^\s*$/ ); 
			s/&amp;/and/;
			s/&/and/g;
			s/\(//g;
			s/\)//g;
			s/\.//g;
			s/'//g;
			$title .= $_;
			s/\s/-/g;
			tr/A-Z/a-z/;
			$file .= $_;
		} 
		#print "title:$title FILE:$file\n"; 
		$body="";
		while( <IN> ) 
		{
			if( /TABLE/i ) 
			{ 
				$body .= $_; 
				while( <IN> )
				{ 
					s/<\/br>//ig;
					$body.= $_; 
					last if ( /<\/TABLE/i );
				} 
				last;
			}
		}
		open OUT,">$file.txt"; 
		print OUT <<"END"; 
TITLE:$title
DESCRIPTION:$title
FILE:d:/www/orthodox.net/recipes/$file.html
TEMPLATE:d:/www/orthodox.net/recipes/3rows2cols-floating.html
TYPE:HTML

BEGIN:row1
$title

BEGIN:row2
<CENTER>$body</CENTER>
END
	print "FILE:$file.txt\n";
	}
}