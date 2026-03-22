for $file ( <*pentecost*> ) 
{ 
	$_=$file; 
	if( /^ / ) 
	{
		s/^ //g;
		$cmd="rename \"$file\" \"$_\""; 
		print $cmd,"\n"; 
		system $cmd;
	}
}
exit;

for $file ( <*week-after-pentecost*> ) 
{ 
	$_=$file; 
	/(.*)\.([a-z]+)$/; $name=$1; $sfx=$2;
	$name=~ s/^ *//;

	#print "FILE:$file $name:$name sfx:$sfx\n";
	if ( $name =~ /(\d+)([a-z]+-week-after-pentecost)_([a-z]+)_(.*)/ )  #11/14/2008
	{ 
		$num=$1; 
		$title=$2;
		$day=$3; 
		$scripture=$4;
		$year="2008";
		$_="_";
		#print "num=($num) title=($title)\n";
		$new=" pentecost-${day}-$num$_$year$_${scripture}.$sfx"; 
		$cmd="rename \"$file\" \"$new\"";
		print $cmd,"\n\n";
		system $cmd;
	}
}