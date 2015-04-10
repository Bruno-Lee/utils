var sort = {
	bubbleSort: function (arr, desc) {  //冒泡排序
		/*
			@param arr 需要排序的数组
			@param desc 是否降序
		*/
		var d = arr.concat();
		for(var i = 0; i < d.length; i++) {
			var flag = false;
			for(var j = 0; j < d.length; j++) {
				if(d[j] > d[j + 1] && desc != true || d[j] < d[j + 1] && desc === true) {
					//升序或降序排列
					var temp = d[j];
					d[j] = d[j + 1];
					d[j + 1] = temp;
					flag = true;
				}
			}
			if(flag === false) {  //一次循环后所有的元素已经有序则不再排序
				break;
			}
		}
		return d;
	},

	quickSort: function (arr, desc) {  //快速排序
		
	}
}